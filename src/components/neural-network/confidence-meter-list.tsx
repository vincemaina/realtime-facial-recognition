interface Props {
    labels?: string[];
    outputLayer: number[] | null;
}

export function ConfidenceMeterList(props: Props) {
    
    const outputLayer = props.outputLayer;
    
    const confidence = outputLayer ? outputLayer.map((value, _) => {
        return value * 100;
    }) : [];
 
    return (
        <div className="flex flex-col gap-5 font-mono">
            {confidence.map((value, index) => (
                <div key={index} className="flex gap-2">
                    {
                        props.labels && props.labels[index] && (
                            <span>{props.labels[index]}</span>
                        )
                    }

                    <div className="h-100% w-96 relative bg-neutral-100">
                        <div className="absolute left-0 top-0 h-full w-full bg-green-400 transition-all duration-75" style={{ transform: `scaleX(${value / 100})` }} />
                    </div>

                    <span>{value.toFixed(0)}%</span>
                </div>
            ))}
        </div>
    );
}