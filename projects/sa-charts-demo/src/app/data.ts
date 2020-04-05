import { timeDay, CountableTimeInterval } from 'd3';

export const dayTimeSeries = [
    { time: 1585526400000, value: 29 },
    { time: 1585580400000, value: 40 },
    { time: 1585584000000, value: 67 },
    { time: 1585587600000, value: 69 },
    { time: 1585591200000, value: 20 },
    { time: 1585594800000, value: 52 },
    { time: 1585598400000, value: 38 },
    { time: 1585602000000, value: 8 },
    { time: 1585605600000, value: 31 },
    { time: 1585530000000, value: [92, 30, 40] },
    { time: 1585533600000, value: 99 },
    { time: 1585537200000, value: 76 },
    { time: 1585540800000, value: 58 },
    { time: 1585544400000, value: 16 },
    { time: 1585548000000, value: 3 },
    { time: 1585551600000, value: 75 },
    { time: 1585555200000, value: 64 },
    { time: 1585558800000, value: 29 },
    { time: 1585562400000, value: 55 },
    { time: 1585566000000, value: 88 },
    { time: 1585569600000, value: 57 },
    { time: 1585573200000, value: 95 },
    { time: 1585576800000, value: 23 },
    { time: 1585609200000, value: 3 },
    { time: 1585612800000, value: 2 },
    { time: 1585616400000, value: 7 },
    { time: 1585620000000, value: 53 },
    { time: 1585623600000, value: 75 },
    { time: 1585627200000, value: 13 },
    { time: 1585630800000, value: 33 }
];

export function generateData(
    interval: CountableTimeInterval,
    step: number,
    periodInInterval: number
): { time: number; value: number | number[] }[] {
    const start = interval.floor(new Date());
    const end = interval.offset(start, periodInInterval);

    const range = interval.range(start, end, step);
    return range.map(d => ({
        time: d.getTime(),
        value: Math.round(Math.random() * 100)
    }));
}

export function toChartData(
    data: { time: number; value: number | number[] }[]
) {
    return data.map(d => [d.time, d.value]);
}
