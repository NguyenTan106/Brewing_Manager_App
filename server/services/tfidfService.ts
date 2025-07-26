const stopwords = require("vietnamese-stopwords");

const removeDiacritics = (str: string) =>
  str
    .normalize("NFD") // tách các dấu ra khỏi từ
    .replace(/đ/g, "d") // thay đ -> d
    .replace(/Đ/g, "D");

const tokenize_category = (text: string) => {
  return removeDiacritics(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(/\s+/)
    .filter(Boolean); // loại từ rỗng
};

interface Document {
  name: string;
  type: string;
  [key: string]: any; // nếu còn field khác như id, image...
}

const tokenize = (text: string) => {
  const cleaned = removeDiacritics(text).toLowerCase();

  const words = cleaned
    .replace(/[^\p{L}\p{N}\s]/gu, "") // bỏ ký tự đặc biệt
    .split(/\s+/) // xác định các từ bằng 1 hoặc nhiều khoảng trắng
    .filter((word) => word && !stopwords.includes(word)); // Loại bỏ stop words

  const chars = cleaned
    .replace(/[^\p{L}\p{N}]/gu, "") // bỏ ký tự không phải chữ/số
    .split(""); // tách ký tự

  // Kết hợp từ + ký tự, bỏ trùng bằng Set
  // return Array.from(new Set([...words, ...chars]));
  return [...words, ...chars];
};

// Công thức chung TF-IDF
// TF(t,d) = số lần t xuất hiện trong tài liệu / tổng số từ trong tài liệu
// IDF(t) = log(N/df(t))
// - N: tổng số tài liệu trong tập
// - df(t): số tài liệu có chứa từ t (hoặc từ khác)
// TF-IDF = TF(t,d) x IDF(t)

export const computeTfIdf = async (query: string, documents: Document) => {
  const totalDocs = documents.length;
  // console.log(totalDocs);
  // B1: Tokenize toàn bộ tài liệu
  const tokenizeDocument = (doc: Document): string[] => {
    return tokenize(
      doc.name +
        doc.type +
        doc.notes +
        doc.note +
        doc.description +
        doc.instruction +
        doc.beerName +
        doc.code +
        doc.id
    );
  };

  const docsTokens = documents.map(tokenizeDocument);

  // B2: Đếm df (document frequency)
  const dfMap: Record<string, number> = {}; // { từ: số tài liệu chứa từ đó }
  docsTokens.forEach((tokens: string[]) => {
    const seen = new Set<string>();
    tokens.forEach((term) => {
      if (!seen.has(term)) {
        dfMap[term] = (dfMap[term] || 0) + 1;
        seen.add(term);
      }
    });
  });
  // B3: Tính TF-IDF của query với từng sách
  const queryTokens = tokenize(query);

  return documents.map((doc: Document, index: number) => {
    // console.log(doc);
    const docTokens = docsTokens[index];
    const tfMap: Record<string, number> = {}; // TF trong document hiện tại

    // Đếm tần suất từ
    docTokens.forEach((term: string) => {
      tfMap[term] = (tfMap[term] || 0) + 1;
    });
    // console.log(tfMap);

    const totalTerms = docTokens.length;
    // console.log(totalTerms);
    // Tính điểm TF-IDF cho các từ trong truy vấn
    let score = 0;
    queryTokens.forEach((term) => {
      const isChar = term.length === 1;
      const tf = (tfMap[term] || 0) / totalTerms;
      const df = dfMap[term] || 1; // tránh chia cho 0
      const idf = Math.log(totalDocs / df);
      const weight = isChar ? 0.2 : 1;
      score += tf * idf * weight;
    });
    // console.log({ ...doc, score });
    return { ...doc, score };
  });
};
