import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Jogador } from '@/types/database';

/**
 * Exportar ranking para PDF
 */
export async function exportarRankingPDF(
  jogadores: Jogador[],
  titulo: string = 'Ranking Beach Tennis - Baixada Santista',
  categoria?: string,
  genero?: string
) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // Cabeçalho premium
  doc.setFillColor(22, 34, 67); // Royal blue escuro
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Título principal
  doc.setTextColor(252, 186, 40); // Primary yellow
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(titulo, pageWidth / 2, 20, { align: 'center' });

  // Subtítulo
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  const subtitulo = [
    categoria ? `Categoria ${categoria}` : '',
    genero ? genero : '',
  ].filter(Boolean).join(' - ');
  
  if (subtitulo) {
    doc.text(subtitulo, pageWidth / 2, 30, { align: 'center' });
  }

  // Data de geração
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  doc.text(`Gerado em: ${dataAtual}`, pageWidth / 2, 36, { align: 'center' });

  yPosition = 50;

  // Tabela de jogadores
  const rowHeight = 12;
  const colWidths = [15, 80, 25, 25, 25];
  const tableWidth = colWidths.reduce((a, b) => a + b, 0);
  const tableX = (pageWidth - tableWidth) / 2;

  // Cabeçalho da tabela
  doc.setFillColor(240, 240, 240);
  doc.rect(tableX, yPosition, tableWidth, rowHeight, 'F');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  
  let xPos = tableX + 2;
  doc.text('#', xPos, yPosition + 8);
  xPos += colWidths[0];
  doc.text('Nome', xPos, yPosition + 8);
  xPos += colWidths[1];
  doc.text('Cat.', xPos, yPosition + 8);
  xPos += colWidths[2];
  doc.text('Gênero', xPos, yPosition + 8);
  xPos += colWidths[3];
  doc.text('Pontos', xPos, yPosition + 8);

  yPosition += rowHeight;

  // Linhas de jogadores
  doc.setFont('helvetica', 'normal');
  jogadores.forEach((jogador, index) => {
    // Alternar cores das linhas
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(tableX, yPosition, tableWidth, rowHeight, 'F');
    }

    // Top 3 com destaque
    if (index < 3) {
      const colors = [
        [252, 186, 40], // Gold
        [192, 192, 192], // Silver
        [205, 127, 50], // Bronze
      ];
        const [r, g, b] = colors[index];
        doc.setFillColor(r, g, b);
        doc.rect(tableX, yPosition, colWidths[0], rowHeight, 'F');
    }

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    xPos = tableX + 2;
    
    // Posição
    doc.setFont('helvetica', index < 3 ? 'bold' : 'normal');
    doc.text((jogador.posicao || 0).toString(), xPos + colWidths[0] / 2, yPosition + 8, { align: 'center' });    
    // Nome
    xPos += colWidths[0];
    doc.setFont('helvetica', 'bold');
    const nomeTexto = jogador.nome.length > 30 ? jogador.nome.substring(0, 27) + '...' : jogador.nome;
    doc.text(nomeTexto, xPos + 2, yPosition + 8);
    
    // Categoria
    doc.setFont('helvetica', 'normal');
    xPos += colWidths[1];
    doc.text(jogador.categoria, xPos + colWidths[2] / 2, yPosition + 8, { align: 'center' });
    
    // Gênero
    xPos += colWidths[2];
    const generoAbrev = jogador.genero === 'Masculino' ? 'M' : 'F';
    doc.text(generoAbrev, xPos + colWidths[3] / 2, yPosition + 8, { align: 'center' });
    
    // Pontos
    xPos += colWidths[3];
    doc.setFont('helvetica', 'bold');
    doc.text(jogador.pontos.toString(), xPos + colWidths[4] / 2, yPosition + 8, { align: 'center' });

    yPosition += rowHeight;

    // Nova página se necessário
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = margin;
    }
  });

  // Rodapé
  const footerY = pageHeight - 15;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Ranking Beach Tennis - Baixada Santista', pageWidth / 2, footerY, { align: 'center' });
  doc.text('Sistema Oficial Homologado', pageWidth / 2, footerY + 5, { align: 'center' });

  // Salvar PDF
  const nomeArquivo = `ranking-${categoria || 'geral'}-${genero || 'todos'}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(nomeArquivo);
}