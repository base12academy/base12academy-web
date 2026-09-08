import styles from "@/app/dashboard/filosofia/filosofia.module.css";

export type HistoriaBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list_item"; text: string }
  | { type: "table"; rows: string[][] };

export default function HistoriaBlocks({ blocks }: { blocks: HistoriaBlock[] }) {
  const rendered: React.ReactNode[] = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (block.type === "list_item") {
      const items = [block.text];
      while (blocks[index + 1]?.type === "list_item") {
        index += 1;
        items.push((blocks[index] as Extract<HistoriaBlock, { type: "list_item" }>).text);
      }
      rendered.push(<ul className={styles.documentList} key={`list-${index}`}>{items.map((item, itemIndex) => <li key={`${itemIndex}-${item.slice(0, 28)}`}>{item}</li>)}</ul>);
      continue;
    }
    if (block.type === "heading") {
      if (block.level <= 2) rendered.push(<h2 key={`heading-${index}`}>{block.text}</h2>);
      else if (block.level === 3) rendered.push(<h3 key={`heading-${index}`}>{block.text}</h3>);
      else rendered.push(<h4 key={`heading-${index}`}>{block.text}</h4>);
      continue;
    }
    if (block.type === "paragraph") {
      rendered.push(<p key={`paragraph-${index}`}>{block.text}</p>);
      continue;
    }
    const [header, ...rows] = block.rows;
    rendered.push(<div className={styles.tableWrap} key={`table-${index}`}><table><thead><tr>{header.map((cell, cellIndex) => <th key={cellIndex}>{cell}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>);
  }

  return <div className={styles.document}>{rendered}</div>;
}
