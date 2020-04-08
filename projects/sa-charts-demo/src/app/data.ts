import { timeDay, CountableTimeInterval } from 'd3';

export function generateData(
    interval: CountableTimeInterval,
    step: number,
    periodInInterval: number
): { time: number; value: number | (number | number[])[] }[] {
    const start = interval.floor(new Date());
    const end = interval.offset(start, periodInInterval);

    const range = interval.range(start, end, step);
    return range.map((d) => ({
        time: d.getTime(),
        value: Math.round(Math.random() * 100),
    }));
}

export function generateBarData(
    interval: CountableTimeInterval,
    step: number,
    periodInInterval: number
) {
    const start = interval.floor(new Date());
    const end = interval.offset(start, periodInInterval);

    const range = interval.range(start, end, step);
    return range.map((d) => ({
        time: d.getTime(),
        value: [
            [Math.round(Math.random() * 50), Math.round(Math.random() * 100)],
            [Math.round(Math.random() * 100), Math.round(Math.random() * 50)],
        ],
    }));
}

export function toChartData(
    data: { time: number; value: number | (number | number[])[] }[]
) {
    return data.map((d) => {
        const arr: (number | number[])[] = [d.time];

        if (Array.isArray(d.value) && Array.isArray(d.value[0])) {
            arr.push(...d.value);
        } else {
            arr.push(d.value as number[]);
        }

        return arr;
    });
}
