import type { DatavizDataset } from '@packages/config-schema/src/document';

function splitDelimitedRows(input: string) {
  return input
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(/[,\t]/).map((cell) => cell.trim()));
}

export function datasetFromDelimitedText(input: string): DatavizDataset {
  const rows = splitDelimitedRows(input);
  const [header = [], ...body] = rows;
  const columns = header.filter(Boolean);

  return {
    columns,
    rows: body
      .filter((row) => row.some(Boolean))
      .map((row) =>
        columns.reduce<Record<string, string>>((record, column, index) => {
          record[column] = row[index] ?? '';
          return record;
        }, {})
      )
  };
}

export function datasetFromJson(input: string): DatavizDataset {
  const parsed = JSON.parse(input) as Array<Record<string, unknown>>;
  const columns = Array.from(
    new Set(parsed.flatMap((row) => Object.keys(row)))
  );

  return {
    columns,
    rows: parsed.map((row) =>
      columns.reduce<Record<string, string>>((record, column) => {
        const value = row[column];
        record[column] = value == null ? '' : String(value);
        return record;
      }, {})
    )
  };
}

export function parseDatasetInput(input: string, mode: 'csv' | 'table' | 'json'): DatavizDataset {
  if (!input.trim()) {
    return { columns: [], rows: [] };
  }

  return mode === 'json' ? datasetFromJson(input) : datasetFromDelimitedText(input);
}

export function inferNumericColumns(dataset: DatavizDataset) {
  return dataset.columns.filter((column) =>
    dataset.rows.every((row) => {
      const value = row[column];
      return value === '' || !Number.isNaN(Number(value));
    })
  );
}

export function datasetToDelimitedText(dataset: DatavizDataset) {
  if (dataset.columns.length === 0) {
    return '';
  }

  const header = dataset.columns.join(',');
  const rows = dataset.rows.map((row) =>
    dataset.columns.map((column) => row[column] ?? '').join(',')
  );

  return [header, ...rows].join('\n');
}
