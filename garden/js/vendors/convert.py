import re


def main():
    name_ordered = None
    #blocks, lost, name_ordered = convert()
    #update(name_ordered)
    merge(name_ordered)

def merge(name_ordered=None):
    outfile = "lib.js"
    if name_ordered is None:
        name_ordered = ()
        with open('_files.txt') as stream:
            for line in stream:
                name_ordered += (line.strip(),)

    print('minify to', outfile)
    ostream = open(outfile, 'w')

    for name in name_ordered:
        fp = os.path.join('converted', "{}.js".format(name))
        if os.path.isfile(fp) is False:
            print('File does not exist:', fp)
            continue
        ostream.write("//# File: {}\n".format(name))
        with open(fp, 'r') as stream:
            for line in stream:
                ostream.write(line)
            ostream.write('\n\n')


def update(name_ordered=None):
    reobj = re.compile("BABYLON", re.IGNORECASE)

    files = tuple(os.walk('out'))[0][2]

    if name_ordered is not None:
        with open(os.path.join('_files.txt'), 'w') as stream:
            for item in name_ordered:
                stream.write("{}\n".format(item))

    if os.path.isdir('converted') is False:
        os.mkdir('converted')

    for filename in files:
        fp = os.path.join('out', filename)
        np = os.path.join('converted', filename)
        lines = ()

        with open(fp, 'r') as fstream:
            for line in fstream:
                lines += (line, )

        wstream =  open(np, 'w')
        skips = (
            # "(function (BABYLON) {",
            # "})(BABYLON || (BABYLON = {}));",
            "var BABYLON;",
            "var Internals;",
            )

        for line in lines:
            if line.strip() in skips:
                continue
            repline = reobj.sub("LIB", line)
            wstream.write(repline)

        wstream.close()


def convert():
    print('convert')
    filename = '../../third-party/babylon.3-1.js'
    blocks = ()
    current_block = ()
    lost = ()
    last_block = None
    fileorder = ()

    with open(filename) as stream:
        inblock = False

        for line in stream:
            sl = line

            if len(sl) == 0:
                continue

            if sl.startswith('var BABYLON;'):
                if inblock is True:
                    print('Old block still open?')
                    blocks += (current_block, )
                    current_block = ()
                inblock = True

            if sl.startswith('//# source'):
                fileorder += (sl, )
                # if sl == '})(BABYLON || (BABYLON = {}));':
                if inblock is False:
                    finished = lost + (line, )
                    blocks += (finished, )
                    last_block = finished
                    continue

                current_block += ( sl, )
                blocks += (current_block, )
                last_block = current_block
                current_block = ()
                inblock = False
                continue


            if inblock is False:
                print('!',)
                lost += (sl, )
                continue

            current_block += ( sl, )


    print('done.', len(blocks))
    for block in blocks:
        # sourceMappingURL=babylon.internalTexture.js.map'
        nn = "{}.js".format('-'.join(block[-1].split('.')[1:-2]))
        mf = os.path.join('out', nn)
        with open(mf, 'w') as stream:
            for line in block:
                stream.write(line)

    name_ordered = ()
    for name in fileorder:
        name_ordered += ('-'.join(name.split('.')[1:-2]), )
    return blocks, lost, name_ordered


import os


if __name__ == '__main__':
    blocks = main()
