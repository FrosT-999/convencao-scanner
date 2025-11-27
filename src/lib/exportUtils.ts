import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface CompanyData {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  natureza_juridica: string;
  data_inicio_atividade: string;
  situacao_cadastral: string;
  uf: string;
  municipio: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  cep: string;
  ddd_telefone_1: string;
  email: string;
}

const formatCNPJ = (cnpj: string) => {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
};

const formatDate = (date: string) => {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

export const exportToPDF = (data: CompanyData) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(16);
  doc.text('Consulta CNPJ - Dados da Empresa', 20, 20);
  
  // Dados da empresa
  doc.setFontSize(12);
  let y = 40;
  const lineHeight = 8;
  
  doc.text(`Razão Social: ${data.razao_social}`, 20, y);
  y += lineHeight;
  
  if (data.nome_fantasia) {
    doc.text(`Nome Fantasia: ${data.nome_fantasia}`, 20, y);
    y += lineHeight;
  }
  
  doc.text(`CNPJ: ${formatCNPJ(data.cnpj)}`, 20, y);
  y += lineHeight;
  
  doc.text(`Situação Cadastral: ${data.situacao_cadastral}`, 20, y);
  y += lineHeight;
  
  doc.text(`CNAE: ${data.cnae_fiscal} - ${data.cnae_fiscal_descricao}`, 20, y);
  y += lineHeight;
  
  doc.text(`Natureza Jurídica: ${data.natureza_juridica}`, 20, y);
  y += lineHeight;
  
  doc.text(`Início das Atividades: ${formatDate(data.data_inicio_atividade)}`, 20, y);
  y += lineHeight + 5;
  
  // Endereço
  doc.setFontSize(14);
  doc.text('Endereço', 20, y);
  y += lineHeight;
  
  doc.setFontSize(12);
  doc.text(`${data.logradouro}, ${data.numero}${data.complemento ? ` - ${data.complemento}` : ''}`, 20, y);
  y += lineHeight;
  
  doc.text(`${data.bairro} - ${data.municipio}/${data.uf}`, 20, y);
  y += lineHeight;
  
  doc.text(`CEP: ${data.cep}`, 20, y);
  y += lineHeight + 5;
  
  // Contato
  if (data.ddd_telefone_1 || data.email) {
    doc.setFontSize(14);
    doc.text('Contato', 20, y);
    y += lineHeight;
    
    doc.setFontSize(12);
    if (data.ddd_telefone_1) {
      doc.text(`Telefone: ${data.ddd_telefone_1}`, 20, y);
      y += lineHeight;
    }
    
    if (data.email) {
      doc.text(`Email: ${data.email}`, 20, y);
    }
  }
  
  // Salvar PDF
  doc.save(`${data.razao_social.replace(/[^a-z0-9]/gi, '_')}_CNPJ.pdf`);
};

export const exportToExcel = (data: CompanyData) => {
  const worksheetData = [
    ['Campo', 'Valor'],
    ['Razão Social', data.razao_social],
    ['Nome Fantasia', data.nome_fantasia || ''],
    ['CNPJ', formatCNPJ(data.cnpj)],
    ['Situação Cadastral', data.situacao_cadastral],
    ['CNAE', `${data.cnae_fiscal} - ${data.cnae_fiscal_descricao}`],
    ['Natureza Jurídica', data.natureza_juridica],
    ['Início das Atividades', formatDate(data.data_inicio_atividade)],
    [''],
    ['Endereço', ''],
    ['Logradouro', `${data.logradouro}, ${data.numero}${data.complemento ? ` - ${data.complemento}` : ''}`],
    ['Bairro', data.bairro],
    ['Município/UF', `${data.municipio}/${data.uf}`],
    ['CEP', data.cep],
    [''],
    ['Contato', ''],
    ['Telefone', data.ddd_telefone_1 || ''],
    ['Email', data.email || ''],
  ];
  
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados da Empresa');
  
  // Salvar Excel
  XLSX.writeFile(workbook, `${data.razao_social.replace(/[^a-z0-9]/gi, '_')}_CNPJ.xlsx`);
};
