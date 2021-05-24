type State = {
    entities: {
        polygons: {
            x: number;
            y: number;
            radius: number;
            angle: number;
            type: string;
            hp: number;
            maxHp: number;
        }[];
        bullets: {
            x: number;
            y: number;
            radius: number;
            id: number;
        }[];
        tanks: {
            x: number;
            y: number;
            radius: number;
            angle: number;
            barrels: {
                x: number;
                y: number;
                w: number;
                h: number;
                angle: number;
            }[];
            hp: number;
            maxHp: number;
            id: number;
        }[];
    };
    x: number;
    y: number;
    w: number;
    h: number;
    id: number;
};