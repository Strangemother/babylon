import re


def main():
    name_ordered = None
    #blocks, lost, name_ordered = convert()
    update(name_ordered)
    merge(name_ordered)

def merge(name_ordered=None):
    outfile = "lib.js"
    if name_ordered is None:
        name_ordered = ()
        with open('_files.txt') as stream:
            for line in stream:
                name_ordered += (line.strip(),)

    print('minify to', outfile, len(name_ordered))
    ostream = open(outfile, 'wb')

    for index, name in enumerate(name_ordered):
        if len(name) == 0:
            print('No name on convert')

        if hasattr(name, 'decode'):
            name = name.decode('utf')
        fp = os.path.join('converted', "{}.js".format(name))

        if os.path.isfile(fp) is False:
            print('File does not exist:', fp)
            continue
        ostream.write(bytes("//# File: {}\n".format(name), 'utf'))
        with open(fp, 'rb') as stream:
            for line in stream:
                ostream.write(line)
            ostream.write(b'\n\n')


def update(name_ordered=None):
    reobj = re.compile("BABYLON", re.IGNORECASE)

    files = tuple(os.walk('out'))[0][2]

    if name_ordered is not None:
        with open(os.path.join('_files.txt'), 'wb') as stream:
            for item in name_ordered:
                stream.write(bytes("{}\n".format(item.decode('utf')), 'utf'))

    if os.path.isdir('converted') is False:
        os.mkdir('converted')

    for filename in files:
        fp = os.path.join('out', filename)
        np = os.path.join('converted', filename)
        lines = ()

        with open(fp, 'rb') as fstream:
            for line in fstream:
                lines += (line, )

        wstream =  open(np, 'wb')
        skips = (
            # "(function (BABYLON) {",
            # "})(BABYLON || (BABYLON = {}));",
            #"var BABYLON;",
            #"var Internals;",
            )

        for line in lines:
            if line.strip() in skips:
                continue
            repline = reobj.sub("LIB", line.decode('utf'))
            wstream.write(bytes(repline, 'utf'))

        wstream.close()


def convert():
    print('convert')
    filename = 'babylon.custom.js'
    blocks = ()
    current_block = ()
    lost = ()
    last_block = None
    fileorder = ()
    counter = 0

    with open(filename, 'rb') as stream:
        inblock = False

        for line in stream:
            counter += 1

            if len(line) == 0:
                continue

            current_block += ( line, )

            if line.startswith(b'//# sourceMapping'):
                fileorder += (line, )
                # if line == '})(BABYLON || (BABYLON = {}));':

                current_block += ( line, )
                blocks += (current_block, )
                last_block = current_block
                current_block = ()
                print('Finished', line)
                continue

    if len(current_block) > 0:
        name = b'//# sourceMappingURL=babylon.last_block.js.map\n'

        fileorder += (name, )
        current_block += (name,)
        blocks += (current_block, )
        last_block = current_block
        print('Finished last object', len(current_block))
        current_block = ()

    print('done.', len(blocks))
    if os.path.isdir('out') is False:
        os.makedirs('out')

    for block in blocks:
        # sourceMappingURL=babylon.internalTexture.js.map'
        name = block[-1].split(b'.')[1:-2]
        if len(name) == 0:
            print('No name')

        nn = "{}.js".format( '-'.join([x.decode('utf') for x in name]))
        mf = os.path.join('out', nn)
        with open(mf, 'wb') as stream:
            for line in block:
                stream.write(line)

    name_ordered = ()
    for name in fileorder:
        if len(name) > 0:
            split = name.split(b'.')[1:-2]
            res = bytes('-'.join([x.decode('utf') for x in split]), 'utf')
            name_ordered += (res,)
    return blocks, lost, name_ordered


import os


if __name__ == '__main__':
    blocks = main()
