function generateTableContent(rowsData, alignMap) {
  var result = [];
  for(var index in rowsData) {
    result.push(`
    <tr id="${rowsData[index].id}">
    `);
    
    result.push("</tr>");
  }
}