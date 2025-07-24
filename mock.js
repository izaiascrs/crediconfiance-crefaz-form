const mockSimulationResponse = {
  success: true,
  data: {
    propostaId: 1045574253,
    aprovado: true,
  },
  errors: null,
};

// const mockSimulationResponse = {
// 	"success": false,
// 	"data": null,
// 	"errors": [
// 		"Você tem uma proposta em andamento para esse cliente, verifique em sua esteira de acompanhamento"
// 	]
// };

const mockOpenProposalResponse = {
  success: false,
  data: null,
  errors: [
    "Você tem uma proposta em andamento para esse cliente, verifique em sua esteira de acompanhamento",
  ],
};

const mockGetOfferResponse = {
  success: true,
  data: {
    produtos: [
      {
        id: 1,
        nome: "Boleto",
        tabelaJuros: [
          {
            id: 1,
            nome: "Tabela Boleto Padrão",
            tabelaJurosValores: [
              { id: 8, plano: 8, juros: 15 },
              { id: 9, plano: 9, juros: 15 },
              { id: 11, plano: 11, juros: 15 },
              { id: 12, plano: 12, juros: 15 },
              { id: 2523, plano: 19, juros: 15 },
              { id: 2524, plano: 20, juros: 15 },
              { id: 2525, plano: 21, juros: 15 },
              { id: 2526, plano: 22, juros: 15 },
              { id: 2527, plano: 23, juros: 15 },
              { id: 2528, plano: 24, juros: 15 },
              { id: 2983, plano: 13, juros: 15 },
              { id: 2984, plano: 14, juros: 15 },
              { id: 2985, plano: 15, juros: 15 },
              { id: 2986, plano: 16, juros: 15 },
              { id: 2987, plano: 17, juros: 15 },
              { id: 2988, plano: 18, juros: 15 },
            ],
          },
        ],
        convenio: [],
      },
      {
        id: 6,
        nome: "Energia",
        convenio: [
          {
            id: 14,
            nome: "CPFL PAULISTA",
            // convenioDados: [
            //   {
            //     convenioDadosId: 18,
            //     convenioId: 4,
            //     nome: "N° da instalação",
            //     tipo: 1,
            //     ordem: 1,
            //     formato: "^([0]\\d{1,13}|[1-9]\\d{0,13})$",
            //     mensagem:
            //       "N° da instalação inválido. Informe o N° da instalação.",
            //   },
            //   {
            //     convenioDadosId: 24,
            //     convenioId: 4,
            //     nome: "Data de Leitura",
            //     tipo: 4,
            //     ordem: 2,
            //     mensagem: "Data inválida",
            //   },
            //   {
            //     convenioDadosId: 22038,
            //     convenioId: 4,
            //     nome: "Data de Vencimento",
            //     tipo: 4,
            //     ordem: 3,
            //     mensagem: "Data inválida",
            //   },
            // ],
            convenioDados: [
              {
                convenioDadosId: 1048,
                nome: "Seu Código",
                tipo: 1,
                ordem: 1,
                formato: "^([0]\\d{1,9}|[1-9]\\d{0,9})$",
              },
              {
                convenioDadosId: 1046,
                nome: "Lote",
                tipo: 1,
                ordem: 3,
                formato: "^([0-9]\\d{0,13})$",
              },
            ],
            tabelaJuros: [
              {
                id: 199,
                nome: "CPFL PAULISTA 3",
                tabelaJurosValores: [
                  {
                    valor: 3300.0,
                  },
                  {
                    valor: 3200.0,
                  },
                  {
                    valor: 3100.0,
                  },
                  {
                    valor: 3000.0,
                  },
                  {
                    valor: 2900.0,
                  },
                  {
                    valor: 2800.0,
                  },
                  {
                    valor: 2700.0,
                  },
                  {
                    valor: 2600.0,
                  },
                  {
                    valor: 2500.0,
                  },
                  {
                    valor: 2400.0,
                  },
                  {
                    valor: 2300.0,
                  },
                  {
                    valor: 2200.0,
                  },
                  {
                    valor: 2100.0,
                  },
                  {
                    valor: 2000.0,
                  },
                  {
                    valor: 1900.0,
                  },
                  {
                    valor: 1800.0,
                  },
                  {
                    valor: 1700.0,
                  },
                  {
                    valor: 1600.0,
                  },
                  {
                    valor: 1500.0,
                  },
                  {
                    valor: 1400.0,
                  },
                  {
                    valor: 1300.0,
                  },
                  {
                    valor: 1200.0,
                  },
                  {
                    valor: 1100.0,
                  },
                  {
                    valor: 1000.0,
                  },
                  {
                    valor: 900.0,
                  },
                  {
                    valor: 800.0,
                  },
                  {
                    valor: 700.0,
                  },
                  {
                    valor: 600.0,
                  },
                  {
                    valor: 500.0,
                  },
                  {
                    valor: 450.0,
                  },
                  {
                    valor: 400.0,
                  },
                ],
              },
            ],
          },
        ],
        orgao: [],
        tabelaJuros: [],
        diaRecebimento: [
          {
            id: -5,
            nome: "5º dia útil",
          },
          {
            id: -4,
            nome: "4º dia útil",
          },
          {
            id: -3,
            nome: "3º dia útil",
          },
          {
            id: -2,
            nome: "2º dia útil",
          },
          {
            id: -1,
            nome: "1º dia útil",
          },
          {
            id: 1,
            nome: "1",
          },
          {
            id: 2,
            nome: "2",
          },
          {
            id: 3,
            nome: "3",
          },
          {
            id: 4,
            nome: "4",
          },
          {
            id: 5,
            nome: "5",
          },
          {
            id: 6,
            nome: "6",
          },
          {
            id: 7,
            nome: "7",
          },
          {
            id: 8,
            nome: "8",
          },
          {
            id: 9,
            nome: "9",
          },
          {
            id: 10,
            nome: "10",
          },
          {
            id: 11,
            nome: "11",
          },
          {
            id: 12,
            nome: "12",
          },
          {
            id: 13,
            nome: "13",
          },
          {
            id: 14,
            nome: "14",
          },
          {
            id: 15,
            nome: "15",
          },
          {
            id: 16,
            nome: "16",
          },
          {
            id: 17,
            nome: "17",
          },
          {
            id: 18,
            nome: "18",
          },
          {
            id: 19,
            nome: "19",
          },
          {
            id: 20,
            nome: "20",
          },
          {
            id: 21,
            nome: "21",
          },
          {
            id: 22,
            nome: "22",
          },
          {
            id: 23,
            nome: "23",
          },
          {
            id: 24,
            nome: "24",
          },
          {
            id: 25,
            nome: "25",
          },
          {
            id: 26,
            nome: "26",
          },
          {
            id: 27,
            nome: "27",
          },
          {
            id: 28,
            nome: "28",
          },
          {
            id: 29,
            nome: "29",
          },
          {
            id: 30,
            nome: "30",
          },
          {
            id: 31,
            nome: "31",
          },
        ],
        controleRenda: 0,
      },
    ],
    proposta: {
      nome: "izaias caio ribeiro silva",
      cpf: "05671181186",
      valorRendaPresumida: 1254.76,
    },
  },
  errors: null,
};

const mockMaxAvailableOfferResponse = {
  success: true,
  data: {
    valorLimiteSolicitado: 1700,
    valorLimiteParcela: 255.54,
    valorLimiteMinimoParcela: 67.62,
  },
  errors: null,
};

const mockGetSimulationByCepResponse = {
  id: 1046003285,
  status: "Aguard. Cadastro",
  name: "IZAIAS CAIO",
  situacaoId: 3,
};

const mockDueDateResponse = {
  success: true,
  data: [
    {
      vencimento: "2025-07-26",
    },
  ],
  errors: null,
};

const mockGetParcelResponse = {
  success: true,
  data: {
    produtoId: 6,
    tipoCalculo: 0,
    tabelaJurosId: 199,
    valorLimite: 3300.0,
    prazoValor: [
      {
        prazo: 22,
        valor: 270.23,
      },
      {
        prazo: 20,
        valor: 275.69,
      },
      {
        prazo: 18,
        valor: 282.9,
      },
      {
        prazo: 16,
        valor: 292.56,
      },
      {
        prazo: 15,
        valor: 298.65,
      },
      {
        prazo: 12,
        valor: 325.0,
      },
    ],
  },
  errors: null,
};

const mockSaveProposalResponse = {
  success: true,
  data: {
    propostaId: 1045574253,
    aprovado: true,
    novoLimite: {
      valorLimiteSolicitado: 3300.0,
      valorLimiteParcela: 590.34,
      valorLimiteMinimoParcela: 67.62,
    },
  },
  errors: null,
};

const mockGetSimulationResponse = {
  success: true,
  data: {
    proposta: {
      id: 1045846497,
      situacaoDescricao: "Seleção Oferta", // Seleção Oferta, Aguard. Cadastro, Aguard. Aprovação, Aguard. Análise, Cancelada
      operacao: {
        produtoId: 6,
        produtoNome: "Energia",
        convenioId: 14,
        convenioNome: "CPFL PAULISTA",
        orgaoId: null,
        orgaoNome: null,
        vencimento: "2025-07-30T00:00:00",
        tabelaJurosId: 200,
        tabelaJurosNome: "CPFL PAULISTA 4",
        taxa: 13.96,
        operacao: 5713.2,
        valorContratado: 1800.0,
        prazo: 20,
        iof: 55.49,
        prestacao: 285.66,
        renda: 1761.19,
        tipoRenda: 0,
        saldoDevedor: null,
        dadosAdicionais: [
          {
            nome: "Seu C\u00F3digo",
            tipo: 1,
            formato: "^([0]\\d{1,9}|[1-9]\\d{0,9})$",
            valor: "13405055",
          },
          {
            nome: "PN",
            tipo: 1,
            formato: "^([0]\\d{1,13}|[1-9]\\d{0,13})$",
            valor: "0701022199",
          },
          { nome: "Lote", tipo: 1, formato: "^([0-9]\\d{0,13})$", valor: "04" },
        ],
        valorDebitoConcorrente: null,
        diaRecebimento: 5,
      },
      cliente: {
        cpf: "59477156000",
        nome: "IZAIAS",
        nascimento: "1994-02-28T00:00:00",
        rg: null,
        rgEmissor: null,
        rgUf: null,
        rgEmissao: null,
        sexo: null,
        estadoCivil: null,
        nacionalidadeId: null,
        naturalidadeCidadeId: null,
        grauInstrucaoId: null,
        nomeMae: null,
        nomeConjuge: null,
        pep: false,
      },
      contatos: {
        contato: {
          email: null,
          telefone: "61995745308",
          tipoTelefone: 1,
          telefoneExtra: [],
        },
        referencia: [],
      },
      endereco: {
        cep: "13170011",
        logradouro: null,
        numero: null,
        cidadeId: 5313,
        bairro: null,
        complemento: null,
      },
      bancario: {
        bancoId: null,
        banco: null,
        agencia: null,
        digito: null,
        numero: null,
        conta: null,
        tipoConta: null,
        tempoConta: null,
      },
      profissional: {
        empresa: null,
        ocupacaoId: 1,
        profissaoId: null,
        tempoEmpregoAtual: null,
        telefoneRH: null,
        pisPasep: null,
        renda: 1761.19,
        tipoRenda: 0,
        outrasRendas: null,
        tipoOutrasRendas: null,
        orgaoDados: [],
      },
      motivo: [],
      debitosConveniada: null,
    },
  },
  errors: null,
};

// const mockGetSimulationResponse = {
//   success: true,
//   data: {
//     proposta: {
//       id: 1045863639,
//       situacaoDescricao: "Seleção Oferta",
//       operacao: {
//         produtoId: null,
//         produtoNome: null,
//         convenioId: null,
//         convenioNome: null,
//         orgaoId: null,
//         orgaoNome: null,
//         vencimento: null,
//         tabelaJurosId: null,
//         tabelaJurosNome: null,
//         taxa: null,
//         operacao: null,
//         valorContratado: null,
//         prazo: null,
//         iof: null,
//         prestacao: null,
//         renda: null,
//         tipoRenda: null,
//         saldoDevedor: null,
//         dadosAdicionais: [],
//         valorDebitoConcorrente: null,
//         diaRecebimento: null,
//       },
//       cliente: {
//         cpf: "05671181186",
//         nome: "IZAIAS CAIO RIBEIRO SILVA",
//         nascimento: "1994-02-28T00:00:00",
//         rg: null,
//         rgEmissor: null,
//         rgUf: null,
//         rgEmissao: null,
//         sexo: null,
//         estadoCivil: null,
//         nacionalidadeId: null,
//         naturalidadeCidadeId: null,
//         grauInstrucaoId: null,
//         nomeMae: null,
//         nomeConjuge: null,
//         pep: false,
//       },
//       contatos: {
//         contato: {
//           email: null,
//           telefone: "61995745308",
//           tipoTelefone: 1,
//           telefoneExtra: [],
//         },
//         referencia: [],
//       },
//       endereco: {
//         cep: "13170011",
//         logradouro: null,
//         numero: null,
//         cidadeId: 5313,
//         bairro: null,
//         complemento: null,
//       },
//       bancario: {
//         bancoId: null,
//         banco: null,
//         agencia: null,
//         digito: null,
//         numero: null,
//         conta: null,
//         tipoConta: null,
//         tempoConta: null,
//       },
//       profissional: {
//         empresa: null,
//         ocupacaoId: 1,
//         profissaoId: null,
//         tempoEmpregoAtual: null,
//         telefoneRH: null,
//         pisPasep: null,
//         renda: null,
//         tipoRenda: null,
//         outrasRendas: null,
//         tipoOutrasRendas: null,
//         orgaoDados: [],
//       },
//       motivo: [{ motivoId: 48, nome: "Solicitado pela loja" }],
//       debitosConveniada: null,
//     },
//   },
//   errors: null,
// };

const mockUploadDocumentResponse = {
  success: true,
  data: "Upload Concluido",
  errors: null,
};

const mockListCitiesResponse = {
  success: true,
  data: [
    {
      cidadeId: 2388,
      cidadeNome: "Abadia de Goiás",
      codigoIBGE: 5200050,
      ufId: 9,
      uf: "GO",
    },
    {
      cidadeId: 2435,
      cidadeNome: "Abadiânia",
      codigoIBGE: 5200100,
      ufId: 9,
      uf: "GO",
    },
    {
      cidadeId: 2436,
      cidadeNome: "Acreúna",
      codigoIBGE: 5200134,
      ufId: 9,
      uf: "GO",
    },
    {
      cidadeId: 2397,
      cidadeNome: "Adelândia",
      codigoIBGE: 5200159,
      ufId: 9,
      uf: "GO",
    },
    {
      cidadeId: 2398,
      cidadeNome: "Água Fria de Goiás",
      codigoIBGE: 5200175,
      ufId: 9,
      uf: "GO",
    },
    {
      cidadeId: 2399,
      cidadeNome: "Água Limpa",
      codigoIBGE: 5200209,
      ufId: 9,
      uf: "GO",
    },
    {
      cidadeId: 2400,
      cidadeNome: "Águas Lindas de Goiás",
      codigoIBGE: 5200258,
      ufId: 9,
      uf: "GO",
    },
    {
      cidadeId: 2401,
      cidadeNome: "Alexânia",
      codigoIBGE: 5200308,
      ufId: 9,
      uf: "GO",
    },
    {
      cidadeId: 2402,
      cidadeNome: "Aloândia",
      codigoIBGE: 5200506,
      ufId: 9,
      uf: "GO",
    },
    {
      cidadeId: 2403,
      cidadeNome: "Alto Horizonte",
      codigoIBGE: 5200555,
      ufId: 9,
      uf: "GO",
    },
    {
      cidadeId: 2434,
      cidadeNome: "Alto Paraíso de Goiás",
      codigoIBGE: 5200605,
      ufId: 9,
      uf: "GO",
    },
    {
      cidadeId: 2418,
      cidadeNome: "Alvorada do Norte",
      codigoIBGE: 5200803,
      ufId: 9,
      uf: "GO",
    },
  ],
  errors: null,
};

const mockSubmitProposalResponse = {
  success: true,
  data: "Sucesso!",
  errors: null,
};

const mockSearchByCpfResponse = {
  id: 1046003285,
  status: "Aguard. Cadastro",
  name: "IZAIAS CAIO",
  situacaoId: 3,
};

const mockValidateEneryDataResponse = {
  success: true,
  data: {
    unidadeCorreta: true,
  },
};

const mockDocumentTypesResponse = {
  success: true,
  data: [
    {
      id: 1,
      produtoId: 6,
      nome: "DOCUMENTO DE IDENTIFICAÇÃO",
      tipoModalidade: 0,
      tipoRenda: null,
      obrigatorio: true,
    },
    {
      id: 30,
      produtoId: 6,
      nome: "FATURA DE ENERGIA",
      tipoModalidade: 0,
      tipoRenda: null,
      obrigatorio: true,
    },
    {
      id: 32,
      produtoId: 6,
      nome: "OUTROS",
      tipoModalidade: 0,
      tipoRenda: null,
      obrigatorio: false,
    },
  ],
  errors: null,
};

export {
  mockSimulationResponse,
  mockGetOfferResponse,
  mockDueDateResponse,
  mockGetParcelResponse,
  mockSaveProposalResponse,
  mockGetSimulationResponse,
  mockUploadDocumentResponse,
  mockListCitiesResponse,
  mockOpenProposalResponse,
  mockGetSimulationByCepResponse,
  mockSubmitProposalResponse,
  mockSearchByCpfResponse,
  mockMaxAvailableOfferResponse,
  mockValidateEneryDataResponse,
  mockDocumentTypesResponse,
};
