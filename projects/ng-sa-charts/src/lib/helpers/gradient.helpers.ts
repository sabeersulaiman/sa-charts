import { Selection } from 'd3';

export function defineColorFadingGradient(
    color: string,
    defs: Selection<SVGDefsElement, any, any, any>
) {
    /*
    <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
    </linearGradient>
     */
    const colorId = getIdFromColor(color, false);

    if (
        !defs ||
        !defs.node() ||
        defs.select('linearGradient' + colorId).node()
    ) {
        return;
    }

    const gradient = defs
        .append('linearGradient')
        .attr('id', colorId)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

    gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('style', `stop-color:${color};stop-opacity:1;`);

    gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('style', `stop-color:${color};stop-opacity:0;`);
}

export function getIdFromColor(color: string, needPound = true) {
    let id = '';
    for (const c of color) {
        if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z')) {
            id += c;
        }
    }

    return needPound ? `#${id}` : id;
}
