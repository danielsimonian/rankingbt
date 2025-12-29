/**
 * Utilidades para manipulação de datas
 * Evita problemas de timezone ao trabalhar com datas do banco
 */

/**
 * Formata uma data do formato ISO (YYYY-MM-DD) para o formato brasileiro (DD/MM/YYYY)
 * Evita problemas de timezone ao criar a data no fuso horário local
 * 
 * @param data - String no formato 'YYYY-MM-DD' (ex: '2024-12-20')
 * @returns String no formato 'DD/MM/YYYY' (ex: '20/12/2024')
 * 
 * @example
 * formatarData('2024-12-20') // '20/12/2024'
 */
export const formatarData = (data: string): string => {
  if (!data) return '';
  
  const [ano, mes, dia] = data.split('-');
  return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia))
    .toLocaleDateString('pt-BR');
};

/**
 * Formata uma data do formato ISO para formato curto (DD/MM)
 * Útil para exibições compactas
 * 
 * @param data - String no formato 'YYYY-MM-DD'
 * @returns String no formato 'DD/MM'
 * 
 * @example
 * formatarDataCurta('2024-12-20') // '20/12'
 */
export const formatarDataCurta = (data: string): string => {
  if (!data) return '';
  
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}`;
};

/**
 * Formata uma data do formato ISO para formato extenso
 * 
 * @param data - String no formato 'YYYY-MM-DD'
 * @returns String no formato extenso (ex: '20 de dezembro de 2024')
 * 
 * @example
 * formatarDataExtenso('2024-12-20') // '20 de dezembro de 2024'
 */
export const formatarDataExtenso = (data: string): string => {
  if (!data) return '';
  
  const [ano, mes, dia] = data.split('-');
  const date = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
  
  return date.toLocaleDateString('pt-BR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

/**
 * Calcula a diferença em dias entre duas datas
 * 
 * @param dataInicial - String no formato 'YYYY-MM-DD'
 * @param dataFinal - String no formato 'YYYY-MM-DD'
 * @returns Número de dias de diferença
 * 
 * @example
 * calcularDiferencaDias('2024-12-20', '2024-12-25') // 5
 */
export const calcularDiferencaDias = (dataInicial: string, dataFinal: string): number => {
  const [ano1, mes1, dia1] = dataInicial.split('-');
  const [ano2, mes2, dia2] = dataFinal.split('-');
  
  const data1 = new Date(parseInt(ano1), parseInt(mes1) - 1, parseInt(dia1));
  const data2 = new Date(parseInt(ano2), parseInt(mes2) - 1, parseInt(dia2));
  
  const diffTime = Math.abs(data2.getTime() - data1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Verifica se uma data está no passado
 * 
 * @param data - String no formato 'YYYY-MM-DD'
 * @returns true se a data é passada, false caso contrário
 * 
 * @example
 * isDataPassada('2024-01-01') // true (se hoje é depois de 01/01/2024)
 */
export const isDataPassada = (data: string): boolean => {
  const [ano, mes, dia] = data.split('-');
  const dataComparar = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  return dataComparar < hoje;
};

/**
 * Verifica se uma data está no futuro
 * 
 * @param data - String no formato 'YYYY-MM-DD'
 * @returns true se a data é futura, false caso contrário
 */
export const isDataFutura = (data: string): boolean => {
  const [ano, mes, dia] = data.split('-');
  const dataComparar = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  return dataComparar > hoje;
};

/**
 * Retorna a data de hoje no formato YYYY-MM-DD
 * 
 * @returns String no formato 'YYYY-MM-DD'
 * 
 * @example
 * getDataHoje() // '2024-12-28'
 */
export const getDataHoje = (): string => {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  
  return `${ano}-${mes}-${dia}`;
};