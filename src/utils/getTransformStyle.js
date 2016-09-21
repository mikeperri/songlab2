export default function getTransformStyle(beatIndex, division, beatWidth) {
    let x = (beatIndex * beatWidth) +
        ((division[0] / division[1]) * beatWidth);

    return `translateX(${x}px)`;
};
