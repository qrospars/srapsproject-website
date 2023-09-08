import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const CanvasBackground: React.FC = () => {
    const engineRef = useRef<Matter.Engine | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const [shapes, setShapes] = useState<Matter.Body[]>([]);
    const mouseTarget = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const transform = useRef({ x: 0, y: 0 });
    const renderRef = useRef<Matter.Render | null>(null);
    const colors = [
        '#cde3dd', '#d3d7e0', '#d7d6e0', '#d8e3db',
        '#d5d4e2', '#c5cfe5', '#b9c5e5', '#b0c8e8',
        '#bfd4e7'
    ];

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            mouseTarget.current = { x: event.clientX, y: event.clientY };
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;

        engineRef.current = initializeEngine(canvasRef.current);

        const polygons = colors.map(color => {
            const posX = Math.random() * window.innerWidth;
            const posY = Math.random() * window.innerHeight;
            const size = 100 + Math.random() * 300;
            return createCurvedPolygon(posX, posY, 6, size, color);
        });

        setShapes(polygons);
        Matter.World.add(engineRef.current.world, polygons);

        const animationLoop = () => {
            const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;
            const maxX = window.innerWidth * 0.30;
            const maxY = window.innerHeight * 0.30;
            const speed = 0.01;

            const distX = mouseTarget.current.x - window.innerWidth / 2;
            const distY = mouseTarget.current.y - window.innerHeight / 2;

            const targetX = Math.min(maxX, Math.max(-maxX, distX * speed));
            const targetY = Math.min(maxY, Math.max(-maxY, distY * speed));

            transform.current.x = lerp(transform.current.x, targetX, 0.05);
            transform.current.y = lerp(transform.current.y, targetY, 0.05);

            canvasRef.current!.style.transform = `translate(${transform.current.x}px, ${transform.current.y}px)`;
            requestAnimationFrame(animationLoop);
        };

        requestAnimationFrame(animationLoop);

        return () => {
            if (renderRef.current) {
                renderRef.current.canvas.remove();
                Matter.Render.stop(renderRef.current);
                renderRef.current = null;
            }
            if (engineRef.current) {
                Matter.Engine.clear(engineRef.current);
            }
        };
    }, []);

    const initializeEngine = (element: HTMLDivElement): Matter.Engine => {
        const engine = Matter.Engine.create();
        const render = Matter.Render.create({
            element: element,
            engine: engine,
            options: {
                width: window.innerWidth * 1.5,
                height: window.innerHeight * 1.5,
                // background: '#161616',
                background: '#E1EAE8',
                wireframes: false
            }
        });

        renderRef.current = render;
        Matter.Render.run(renderRef.current);

        return engine;
    };

    const createCurvedPolygon = (x: number, y: number, sides: number, size: number, color: string) => {
        const angleStep = (2 * Math.PI) / sides;
        const path: Matter.Vector[] = [];
        const variation = size * 0.80; // Adjust for how much randomness you want

        for (let i = 0; i < sides; i++) {
            const randomFactor = 1 + (Math.random() - 0.5) * 2 * (variation / size);
            const xx = x + randomFactor * size * Math.cos(i * angleStep);
            const yy = y + randomFactor * size * Math.sin(i * angleStep);
            path.push({ x: xx, y: yy });
        }

        return Matter.Bodies.fromVertices(x, y, [Matter.Vertices.clockwiseSort(path)], {
            render: {
                fillStyle: color,
                // Other render properties
            }
        });
    };


    return <div ref={canvasRef} className="canvas-container" />;
};

export default CanvasBackground;
