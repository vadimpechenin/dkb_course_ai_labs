import type {
    SampleSelectorProps
} from "../../types/Dataset";


export default function SampleSelector({
    samples,
    selectedIds,
    onChange
}: SampleSelectorProps) {

    function toggleSample(id: string) {

        if (selectedIds.includes(id)) {
            onChange(
                selectedIds.filter(
                    selectedId => selectedId !== id
                )
            );

            return;
        }

        onChange([
            ...selectedIds,
            id
        ]);
    }

    function selectAll() {
        onChange(
            samples.map(sample => sample.id)
        );
    }

    function clearAll() {
        onChange([]);
    }

    return (
        <div>
            <h2>Образцы</h2>

            <div style={{ marginBottom: "10px" }}>
                <button
                    type="button"
                    onClick={selectAll}
                >
                    Выбрать все
                </button>

                {" "}

                <button
                    type="button"
                    onClick={clearAll}
                >
                    Снять выбор
                </button>
            </div>

            <div
                style={{
                    maxHeight: "300px",
                    overflowY: "auto"
                }}
            >
                {samples.map(sample => (
                    <label
                        key={sample.id}
                        style={{
                            display: "block",
                            marginBottom: "5px"
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(
                                sample.id
                            )}
                            onChange={() =>
                                toggleSample(sample.id)
                            }
                        />

                        {" "}

                        Образец #{sample.sample_number ?? "—"}

                        {" — "}

                        {sample.id}

                        {" — Tool: "}

                        {sample.tool_id}
                    </label>
                ))}
            </div>
        </div>
    );
}