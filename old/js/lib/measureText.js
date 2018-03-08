
var MEASURES = {
    em: {
        px: .7
    }
}

var measureText = function(text, font, gpx) {
    stubC.font = font
    var m = stubC.measureText(text)
    var e = document.createElement('span')
    e.innerHTML = text
    e.style.font = font
    document.body.appendChild(e)
    var height = e.offsetHeight
    gpx = gpx == undefined? height: gpx;
    var size = [
            m.width * MEASURES.em.px,
            gpx * MEASURES.em.px
        ];

    document.body.removeChild(e)
    return size

}
