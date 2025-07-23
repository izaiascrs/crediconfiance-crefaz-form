import {
  mockSimulationResponse,
  mockGetOfferResponse,
  mockDueDateResponse,
  mockGetParcelResponse,
  mockSaveProposalResponse,
  mockGetSimulationResponse,
  mockUploadDocumentResponse,
  mockListCitiesResponse,
  mockSubmitProposalResponse,
  mockSearchByCpfResponse,
  mockMaxAvailableOfferResponse,
  mockValidateEneryDataResponse,
} from "./mock.js";

// import gsap from cdn
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm';

const SimulationStep = {
  OFFER: "Seleção Oferta",
  WAITING_SUBMISSION: "Aguard. Cadastro",
  WAITING_ANALYSIS: "Aguard. Análise",
  save: function(step) {
    localStorage.setItem("simulationStep", step);
  },
  get: function() {
    return localStorage.getItem("simulationStep");
  },
  clear: function() {
    localStorage.removeItem("simulationStep");
  }
}

class ApiManager {
  endpoint = {
    simulation: "/api/conta-luz/v2/create-proposal",
    getOffer: "/api/conta-luz/v2/offer",
    dueDate: "/api/conta-luz/v2/due-date",
    getParcel: "/api/conta-luz/v2/product-offer",
    maxAvailableOffer: "/api/conta-luz/v2/product-offer/max-value",
    updateProposal: "/api/conta-luz/v2/update-proposal",
    getSimulation: "/api/conta-luz/v2/simulation/search",
    uploadDocument: "/api/conta-luz/v2/document/upload",
    listCities: "/api/conta-luz/v2/state/cities",
    submitProposal: "/api/conta-luz/v2/proposal/analyze",
    searchByCpf: "/api/conta-luz/v2/proposal/search-by-cpf",
    validateEnergyData: "/api/conta-luz/v2/proposal/energy/validate",
    saveDataToSheet: "/api/conta-luz/v2/image/upload"
  }

  fetchOptions = {
    get: function() {
      return {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    },
    post: function(body) {
      return {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    },
    put: function(body) {
      return {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    },
    formData: function(body) {
      return {
        method: "POST",
        body: body
      }
    }
  }

  constructor(url = "https://api.example.com", useMock = false) {
    this.apiUrl =  url;
    this.useMock = useMock;   
  }

  createSimulation(data) {
    if (this.useMock) return { success: true, data: mockSimulationResponse ?? {} };    
    const url = this.apiUrl + this.endpoint.simulation;
    return this.fetchData(url, this.fetchOptions.post(data));
  }

  getOffer(offerId) {
    if (this.useMock) return { success: true, data: mockGetOfferResponse ?? {} };
    const url = `${this.apiUrl + this.endpoint.getOffer}/${offerId}`;
    return this.fetchData(url, this.fetchOptions.get());
  }

  getDueDate(data) {
    if (this.useMock) return { success: true, data: mockDueDateResponse ?? {} };
    const url = this.apiUrl + this.endpoint.dueDate;
    return this.fetchData(url, this.fetchOptions.post(data));
  }

  getParcel(data) {
    if (this.useMock) return { success: true, data: mockGetParcelResponse ?? {} };
    const { propostaId, ... bodyData} = data;
    const url = `${this.apiUrl}${this.endpoint.getParcel}/${propostaId}`;
    return this.fetchData(url, this.fetchOptions.post(bodyData));  
  }

  maxAvailableOffer(propostaId, data) {
    if (this.useMock) return { success: true, data: mockMaxAvailableOfferResponse ?? {} };
    const url = `${this.apiUrl + this.endpoint.maxAvailableOffer}/${propostaId}`;
    return this.fetchData(url, this.fetchOptions.post(data));
  }

  validateEnergyData(data) {
    if (this.useMock) return { success: true, data: mockValidateEneryDataResponse ?? {} };
    const url = this.apiUrl + this.endpoint.validateEnergyData;
    return this.fetchData(url, this.fetchOptions.post(data));
  }

  updateProposal(data) {
    if (this.useMock) return { success: true, data: mockSaveProposalResponse ?? {} };
    const url = this.apiUrl + this.endpoint.updateProposal;
    return this.fetchData(url, this.fetchOptions.post(data));
  }

  getSimulation(propostaId) {
    const step = SimulationStep.get();
    if(step) {
      mockGetSimulationResponse.data.proposta.situacaoDescricao = step;
    }
    if (this.useMock) return { success: true, data: mockGetSimulationResponse ?? {} };
    
    const url = `${this.apiUrl + this.endpoint.getSimulation}/${propostaId}`;
    return this.fetchData(url, this.fetchOptions.get());
  }

  uploadDocument(propostaId, data) {
    if (this.useMock) return { success: true, data: mockUploadDocumentResponse ?? {} };
    const url = `${this.apiUrl + this.endpoint.uploadDocument}/${propostaId}`;
    return this.fetchData(url, this.fetchOptions.post(data));
  }

  listCities(uf) {
    if (this.useMock) return { success: true, data: mockListCitiesResponse ?? {} };
    const url = `${this.apiUrl + this.endpoint.listCities}`;
    return this.fetchData(url, this.fetchOptions.post({ uf }));
  }

  submitProposal(propostaId, data) {
    if (this.useMock) return { success: true, data: mockSubmitProposalResponse ?? {} };
    const url = `${this.apiUrl + this.endpoint.submitProposal}/${propostaId}`;    
    return this.fetchData(url, this.fetchOptions.post(data));
  }

  searchByCpf(data) {
    if (this.useMock) return { success: true, data: mockSearchByCpfResponse ?? {} };
    const url = this.apiUrl + this.endpoint.searchByCpf;
    return this.fetchData(url, this.fetchOptions.post(data));
  }

  saveDataToSheet(form) {
    if (this.useMock) return { ok: true };
    const url = this.apiUrl + this.endpoint.saveDataToSheet;
    return this.fetchData(url, this.fetchOptions.formData(form));
  }

  fetchData = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      const data = await response.json();      
      if (!response.ok) {
        return { success: false, error: data };
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }

  checkError(res, message) {
    if (typeof res === 'string') {
      return res.includes(message);
    }

    if (res.errors && Array.isArray(res.errors)) {
      return res.errors.some((error) => error.includes(message));
    }

    if (res.errors && typeof res.errors === 'string') {
      return res.errors.includes(message);
    }

    return false;
  }

  // Função utilitária para retry de qualquer função
  async retry(fn, maxRetries = 3, delay = 1000, backoff = 1.5) {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        
        const result = await fn();
        
        // Se a função retornou um resultado com success: true, retorna imediatamente
        if (result && result.success) {
          if (attempt > 0) {
          }
          return result;
        }
        
        // Se não foi bem-sucedido, guarda o erro
        lastError = result;
        
      } catch (error) {
        console.error(`❌ Erro na tentativa ${attempt + 1}:`, error);
        lastError = { success: false, error };
      }
      
      // Se não é a última tentativa, aguarda antes de tentar novamente
      if (attempt < maxRetries) {
        const waitTime = delay * Math.pow(backoff, attempt);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    console.error(`❌ Falhou após ${maxRetries + 1} tentativas`);
    return lastError;
  }
   
}

class DataManager {
  #userData = {
    // Dados pessoais básicos
    cpf: '',
    nome: '',
    nascimento: '',
    telefone: '',
    email: '',
    
    // Dados de RG e naturalidade
    rg: '',
    rgEmissor: '',
    rgUfId: '',
    rgEmissao: '',
    sexo: 0,
    estadoCivil: 0,
    nacionalidadeId: 1,
    naturalidadeUfId: '',
    naturalidadeCidadeId: '',
    grauInstrucaoId: 4,
    nomeMae: '',
    nomeConjuge: '',
    pep: false,
    
    // Dados de endereço
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    complemento: 'null',
    cidade: '',
    estado: '',
    cidadeId: '',
    
    // Dados bancários
    bancoId: '',
    agencia: '',
    digito: '',
    numeroConta: '',
    conta: 1,
    tipoConta: 0,
    tempoConta: 1
  }

  #userAdditionalData = {
    adicionais: []
  }

  #apiData = {
    propostaId: 0,
    produtoId: 6,
    convenioId: 0,
    tabelaJurosId: 0,
    renda: 0,
    vencimento: '',
    ofertas: [],
    adicionaisApi: [], // Dados adicionais da API
    tabelaJurosValores: [], // Valores para o slider
    parcelasCalculadas: [] // Dados das parcelas calculadas para o slider
  }

  #userSelections = {
    valor: 0,
    prestacao: 0,
    plano: 0,
    diaRecebimento: 5,
    tipoCalculo: 1
  }

  #userDocuments = {
    contaLuz: null,
    idFrente: null,
    idVerso: null
  }

  #cia = {
    nome: '',
  }

  // Mapeamento dos IDs dos documentos
  #documentIds = {
    contaLuz: 48,
    idFrente: 1,
    idVerso: 1
  }

  updateUserData(data) {
    const normalizedData = DataNormalizer.normalizeSimulationData(data)
    this.#userData = { ...this.#userData, ...normalizedData }    
  }

  // Atualiza dados específicos do formulário de dados pessoais
  updateDadosPessoais(data) {
    const normalizedData = DataNormalizer.normalizeDadosPessoais(data)
    this.#userData = { ...this.#userData, ...normalizedData }
  }

  // Atualiza dados de RG e naturalidade
  updateRGData(data) {
    const normalizedData = DataNormalizer.normalizeRGData(data)
    this.#userData = { ...this.#userData, ...normalizedData }
  }

  // Atualiza dados de endereço
  updateAddressData(data) {
    const normalizedData = DataNormalizer.normalizeAddressData(data)
    this.#userData = { ...this.#userData, ...normalizedData }
  }

  updateAddressFromForm(data) {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null && value != undefined)
    );
    this.#userData = { ...this.#userData, ...filteredData }
  }

  // Atualiza dados bancários
  updateBankData(data) {
    const normalizedData = DataNormalizer.normalizeBankData(data)
    this.#userData = { ...this.#userData, ...normalizedData }
  }

  updateApiData(data) {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null && value != undefined)
    );
    this.#apiData = { ...this.#apiData, ...filteredData }
  }

  updateCia(data) {
    this.#cia = { ...this.#cia, ...data }
  }

  updateUserSelections(data) {
    this.#userSelections = { ...this.#userSelections, ...data }
  }

  updateUserAdditionalData(data) {
    this.#userAdditionalData = { ...this.#userAdditionalData, ...data }
  }

  // Atualiza seleções do usuário quando uma oferta é selecionada
  updateUserLoanSelection(loanData) {
    this.#userSelections = { 
      ...this.#userSelections, 
      valor: loanData.valor,
      prestacao: loanData.parcela.valor,
      plano: loanData.parcela.prazo
    }
  }

  // Obtém as seleções atuais do usuário
  getUserSelections() {
    return { ...this.#userSelections };
  }

  getDataForRequest(requestType) {
    switch(requestType) {
      case 'simulation':
        return {
          cpf: this.#userData.cpf,
          nome: this.#userData.nome,
          nascimento: this.#userData.nascimento,
          telefone: this.#userData.telefone,
          cep: this.#userData.cep,
          cidade: this.#userData.cidade,
          estado: this.#userData.estado,
          ocupacaoId: 1
        }

      case 'getSimulation':
        return {
          propostaId: this.#apiData.propostaId
        }

      case 'getOffer':
        return {
          offerId: this.#apiData.propostaId
        }

      case 'getDueDate':
        return {
          propostaId: this.#apiData.propostaId,
          produtoId: this.#apiData.produtoId,
          tabelaJurosId: this.#apiData.tabelaJurosId
        }

      case 'uploadDocument':
        return {
          propostaId: this.#apiData.propostaId,
          documentos: this.prepareDocumentsForUpload.bind(this)
        }

      case 'getParcel':
        return {
          propostaId: this.#apiData.propostaId,
          produtoId: this.#apiData.produtoId,
          tabelaJurosId: this.#apiData.tabelaJurosId,
          valor: this.#userSelections.valor,
          vencimento: this.#apiData.vencimento,
          convenioId: this.#apiData.convenioId
        }

      case 'maxAvailableOffer':
        return {
          propostaId: this.#apiData.propostaId,
          produtoId: this.#apiData.produtoId,
          tabelaJurosId: this.#apiData.tabelaJurosId,
          convenioId: this.#apiData.convenioId,
          vencimento: this.#apiData.vencimento
        }

      case 'saveProposal':
        return {
          id: this.#apiData.propostaId,
          produtoId: this.#apiData.produtoId,
          convenioId: this.#apiData.convenioId,
          tabelaJurosId: this.#apiData.tabelaJurosId,
          valor: this.#userSelections.valor,
          vencimento: this.#apiData.vencimento,
          prestacao: this.#userSelections.prestacao,
          plano: this.#userSelections.plano,
          renda: this.#apiData.renda,
          tipoRenda: 0,
          diaRecebimento: this.#userSelections.diaRecebimento,
          tipoCalculo: this.#userSelections.tipoCalculo,
          adicionais: this.#userAdditionalData.adicionais,
          contratosRefin: []
        }

      case 'searchByCpf':
        return {
          cpf: this.#userData.cpf,
        }

      case 'validateEnergyData':
        return {
          id: this.#apiData.propostaId,
          operacao: {
            produtoId: this.#apiData.produtoId,
            diaRecebimento: this.#userSelections.diaRecebimento,
            tabelaJurosId: this.#apiData.tabelaJurosId,
            vencimento: this.#apiData.vencimento,
            convenioId: this.#apiData.convenioId,
            adicionais: this.#userAdditionalData.adicionais
          }
        }

      case 'submitProposalToAnalyse':
        return {
          id: this.#apiData.propostaId,
          cliente: {
            nome: this.#userData.nome,
            rg: this.#userData.rg,
            rgEmissor: this.#userData.rgEmissor,
            rgUfId: this.#userData.rgUfId,
            rgEmissao: this.#userData.rgEmissao,
            sexo: this.#userData.sexo,
            estadoCivil: this.#userData.estadoCivil,
            nacionalidadeId: 1,
            naturalidadeUfId: this.#userData.naturalidadeUfId,
            naturalidadeCidadeId: this.#userData.naturalidadeCidadeId,
            grauInstrucaoId: this.#userData.grauInstrucaoId,
            nomeMae: this.#userData.nomeMae,
            nomeConjuge: this.#userData.nomeConjuge || null,
            pep: false
          },
          contatos: {
            contato: {
              email: "",
              telefone: this.#userData.telefone,
              telefoneExtra: []
            },
            referencia: [
              {
                nome: this.#userData.nome,
                telefone: this.#userData.telefone,
                grau: 0
              },             
              {
                nome: this.#userData.nome,
                telefone: this.#userData.telefone,
                grau: 0
              },
            ]
          },
          endereco: {
            cep: this.#userData.cep,
            logradouro: this.#userData.logradouro,
            numero: parseInt(this.#userData.numero) || 0,
            bairro: this.#userData.bairro,
            complemento: this.#userData.complemento || "null",
            cidadeId: parseInt(this.#userData.cidadeId) || 0
          },
          bancario: {
            bancoId: this.#userData.bancoId,
            agencia: this.#userData.agencia,
            digito: this.#userData.digito,
            numero: this.#userData.numeroConta,
            conta: this.#userData.conta,
            tipoConta: this.#userData.tipoConta,
            tempoConta: this.#userData.tempoConta
          },
          profissional: {
            empresa: "000",
            profissaoId: 251,
            tempoEmpregoAtual: 2,
            telefoneRH: null,
            pisPasep: null,
            renda: this.#apiData.renda,
            tipoRenda: 0,
            outrasRendas: null,
            tipoOutrasRendas: null
          },
          operacao: {
            produtoId: this.#apiData.produtoId,
            diaRecebimento: this.#userSelections.diaRecebimento,
            tipoModalidade: 2,
            convenioId: this.#apiData.convenioId,
            vencimento: this.#apiData.vencimento,
            tabelaJurosId: this.#apiData.tabelaJurosId,
            valorContratado: this.#userSelections.valor,
            prazo: this.#userSelections.plano,
            prestacao: this.#userSelections.prestacao,
            renda: this.#apiData.renda,
            tipoRenda: 0,
            tipoCalculo: this.#userSelections.tipoCalculo
          }
        }

      case 'saveDataToSheet':
        return {
            nome: this.#userData.nome,
            cpf: DataNormalizer.formatCPFToBrazilian(this.#userData.cpf),
            "nascimento": DataNormalizer.normalizeDateToBrazilian(this.#userData.nascimento),
            "data-de-nascimento": DataNormalizer.normalizeDateToBrazilian(this.#userData.nascimento),
            whatsApp: DataNormalizer.formatPhoneToBrazilian(this.#userData.telefone), // (xx) xxxxx-xxxx
            cep: this.#userData.cep,
            cidade: this.#userData.cidade,
            estado: this.#userData.estado,
            companhia: this.#cia.nome || "N/A",
            valor: this.#userSelections.valor,            
        }
    }
  }

  getValuesForOffer() {
    return this.#apiData.tabelaJurosValores;
  }

  // Retorna o nome da Cia
  getCiaName() {
    return this.#cia.nome;
  }

  // Método para debug (opcional - pode ser removido em produção)
  getStateForDebug() {
    return {
      userData: { ...this.#userData },
      userAdditionalData: { ...this.#userAdditionalData },
      apiData: { ...this.#apiData },
      userSelections: { ...this.#userSelections }
    }
  }

  // Prepara os documentos para upload (método assíncrono)
  async prepareDocumentsForUpload() {
    const documents = [];
    
    try {
      // Processa conta de luz
      if (this.#userDocuments.contaLuz) {
        const contaLuzBase64 = await this.fileToBase64(this.#userDocuments.contaLuz);
        documents.push({
          documentoId: this.#documentIds.contaLuz,
          conteudo: contaLuzBase64
        });
      }

      // Processa RG frente
      if (this.#userDocuments.idFrente) {
        const idFrenteBase64 = await this.fileToBase64(this.#userDocuments.idFrente);
        documents.push({
          documentoId: this.#documentIds.idFrente,
          conteudo: idFrenteBase64
        });
      }

      // Processa RG verso
      if (this.#userDocuments.idVerso) {
        const idVersoBase64 = await this.fileToBase64(this.#userDocuments.idVerso);
        documents.push({
          documentoId: this.#documentIds.idVerso,
          conteudo: idVersoBase64
        });
      }

      return documents;
      
    } catch (error) {
      console.error('❌ Erro ao preparar documentos para upload:', error);
      throw error;
    }
  }

  // Dentro da classe DataManager
  areDocumentsComplete() {
    return (
      this.#userDocuments.contaLuz instanceof File &&
      this.#userDocuments.idFrente instanceof File &&
      this.#userDocuments.idVerso instanceof File
    );
  }

  updateUserDocument(documentType, file) {
    if (['contaLuz', 'idFrente', 'idVerso'].includes(documentType)) {
      this.#userDocuments[documentType] = file;
    }
  }

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Retorna o resultado completo, incluindo o prefixo
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

class DataNormalizer {
  static normalizeSimulationData(rawData) {
    return {
      cpf: this.normalizeCPF(rawData.cpf),
      nome: rawData.nome?.trim(),
      nascimento: this.normalizeDate(rawData.nascimento),
      telefone: this.normalizePhone(rawData.telefone),
      ocupacaoId: 1,
      cep: this.normalizeCEP(rawData.cep),
      cidade: rawData.cidade?.trim(),
      estado: rawData.estado?.trim()
    }
  }

  static normalizeCPF(cpf) {
    return cpf?.replace(/\D/g, "") || ""
  }

  static normalizeDate(date) {
    if (!date) return ""
    const parts = date.split("/")
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`
    }
    return date
  }

  static normalizeDateToBrazilian(date) {
    if (!date) return ""
    const parts = date.split("-")
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`
    }
  }

  static formatPhoneToBrazilian(phone) {
    return phone.replace(/(\d{2})(\d{5})(\d)/, "($1) $2-$3") || ""
  }

  static formatCPFToBrazilian(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") || ""
  }

  static normalizePhone(phone) {
    return phone?.replace(/\D/g, "") || ""
  }

  static normalizeCEP(cep) {
    return cep?.replace(/\D/g, "") || ""
  }

  static normalizeRGData(data) {
    return {
      rg: data.rg?.replace(/\D/g, ""),
      rgEmissor: data.rgEmissor?.trim(),
      rgUfId: data.rgUfId,
      rgEmissao: this.normalizeDate(data.rgEmissao),
      naturalidadeUfId: data.naturalidadeUfId,
      naturalidadeCidadeId: data.naturalidadeCidadeId,
      pep: false
    }
  }

  static normalizeAddressData(data) {
    return {
      cep: this.normalizeCEP(data.cep),
      logradouro: data.logradouro?.trim(),
      numero: data.numero,
      bairro: data.bairro?.trim(),
      complemento: data.complemento?.trim() || "null",      
      cidadeId: data.cidadeId,
    }
  }

  static normalizeBankData(data) {
    return {
      bancoId: data.bancoId?.trim(),
      agencia: data.agencia?.trim(),
      digito: data.digito?.trim(),
      numeroConta: data.numeroConta?.trim(),
      conta: parseInt(data.conta) || 1,
      tipoConta: parseInt(data.tipoConta) || 0,
      tempoConta: parseInt(data.tempoConta) || 1
    }
  }

  static normalizeDadosPessoais(data) {
    return {
      nome: data.nome?.trim(),
      sexo: parseInt(data.sexo) || 0,
      nomeMae: data.nomeMae?.trim(),
      grauInstrucaoId: parseInt(data.grauInstrucaoId) || 3,
      estadoCivil: parseInt(data.estadoCivil) || 0,
      nomeConjuge: data.nomeConjuge?.trim() || null
    }
  }
}

const Utils = {
  formatCurrency: function (value) {
    if (typeof value !== "number") return "";
    return value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  },
  formatCurrencyAbbreviated: function (value) {
    if (typeof value !== "number") return "";
    if (value >= 1000) {
      const thousands = value / 1000;
      const formatted = thousands.toFixed(1).replace(/\.0$/, "");
      return `R$ ${formatted}k`;
    }
    return `R$ ${value}`;
  },
  
  // Função utilitária para extrair dados do usuário da simulação
  extractUserDataFromSimulation(simulationData) {
    const cliente = simulationData?.data?.proposta?.cliente;
    const contatos = simulationData?.data?.proposta?.contatos?.contato;
    const endereco = simulationData?.data?.proposta?.endereco;

    return {
      nome: cliente?.nome || "",
      cpf: cliente?.cpf || "",
      nascimento: cliente?.nascimento ? cliente.nascimento.split("T")[0].split("-").reverse().join("/") : "",
      telefone: contatos?.telefone || "",
      cep: endereco?.cep || "",
    };
  },

  // Função para preencher o formulário com os dados do DataManager
  preencherFormularioComDataManager(dataManager) {
    const userData = dataManager.getDataForRequest('simulation');
    document.getElementById("name").value = userData.nome || "";
    document.getElementById("cpf").value = userData.cpf || "";
    document.getElementById("phone").value = userData.telefone || "";
    // Corrigir data de nascimento para DD/MM/YYYY se vier como YYYY-MM-DD
    let nascimento = userData.nascimento || "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(nascimento)) {
      const [ano, mes, dia] = nascimento.split("-");
      nascimento = `${dia}/${mes}/${ano}`;
    }
    const birthInput = document.getElementById("birthdate");
    if (birthInput) {
      birthInput.value = nascimento;
      birthInput.dispatchEvent(new Event("blur", { bubbles: true }));
    }
    document.getElementById("cep").value = userData.cep || "";
    ["name", "cpf", "phone", "cep"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("blur", { bubbles: true }));
      }
    });
  },

  // Função para preencher o formulário final com os dados do DataManager
  preencherFormularioFinalComEstado(userData) {
    // Ajuste os IDs conforme o seu HTML
    const nomeInput = document.getElementById("nome-completo");
    const cepInput = document.getElementById("cep-endereco");
    const logradouroInput = document.getElementById("logradouro-endereco");
    const bairroInput = document.getElementById("bairro-endereco");
  
    if (nomeInput) nomeInput.value = userData.nome || "";
    if (cepInput) cepInput.value = userData.cep || "";
    if (logradouroInput) logradouroInput.value = userData.logradouro || "";
    if (bairroInput) bairroInput.value = userData.bairro || "";

    cepInput.dispatchEvent(new Event("input", { bubbles: true }));
  },

  limparFormularioPrincipal() {
    ["name", "cpf", "phone", "birthdate", "cep"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    const checkBox = document.getElementById("checkbox-titular");
    if (checkBox) checkBox.checked = false;
  },

  limparFormularioFinal() {
    // Ajuste os IDs conforme o seu HTML
    const campos = [
      "nome-completo",
      "nome-mae",
      "nome-conjuge",
      "cep-endereco",
      "rg",
      "rg-emissor",
      "rg-emissao",
      "logradouro-endereco",
      "bairro-endereco",
      "numero-endereco",
      "complemento-endereco",
      "agencia-bancario",
      "digito-bancario",
      "numero-bancario",
    ];
  
    campos.forEach(id => {
      const input = document.getElementById(id);
      if (input) input.value = "";
    });
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  setErrorMessageToFinalErrorCard(errorMessage) {
    const errorMessageElement = document.querySelector('[data-card-id="erro-final"]');
    if (errorMessageElement) {
      const resultMessageElement = errorMessageElement.querySelector('.result-info h3');
      if (resultMessageElement) {
        resultMessageElement.textContent = errorMessage;
      }
    }    
  }
};

const CiaTips = {
  cia: {
    "CPFL": [
      {
        nomes: ["Seu Código", "Código", "Instalação"],
        dica: "Número da instalação/código encontra-se na parte superior no quadrado Dados da Unidade Consumidora."
      },
      {
        nomes: ["Lote"],
        dica: "Lote fica localizado no canto superior esquerdo da sua conta de energia."
      }
    ],
    "ENEL GO": [
      {
        nomes: ["Código", "Instalação"],
        dica: "Número da instalação encontra-se no canto superior esquerdo da sua conta de energia."
      },
      {
        nomes: ["Data de Leitura", "Leitura"],
        dica: "Nas contas de energia localiza-se o campo Leitura Atual, junto aos dados de medição."
      }
    ],
    "ENEL CE": [
      {
        nomes: ["Nº DO CLIENTE", "Cliente"],
        dica: "Número do cliente fica abaixo da instalação/Unid. Consumidora, localizado no canto superior direito."
      },
      {
        nomes: ["Rota", "Número da Rota"],
        dica: "Rota é identificado na fatura impressa com o 4º e 5º número."
      }
    ],
    "ENEL SP": [
      {
        nomes: ["Cliente", "Unidade Consumidora"],
        dica: "Número da Unidade Consumidora se encontra-se no canto superior direito."
      },
      {
        nomes: ["Data de Leitura", "Leitura"],
        dica: "Nas faturas impressa localiza-se o campo Leitura Atual, junto ao quadro dados de medição."
      }
    ],
    "ENEL RJ": [
      {
        nomes: ["Nº DO CLIENTE", "Cliente"],
        dica: "Número do cliente encontra-se no canto superior direito da sua conta de energia."
      },
      {
        nomes: ["Rota", "Número da Rota"],
        dica: "Rota é identificado na fatura impressa com o 4º e 5º número."
      }
    ],
    "RGE": [
      {
        nomes: ["Nº da Instalação", "Instalação"],
        dica: "Número da instalação se encontra-se no canto superior direito da sua conta de energia."
      },
      {
        nomes: ["Nº do Lote", "Lote"],
        dica: "Número do lote encontra-se no canto esquerdo abaixo dos dados do títular."
      },
    ]
  },

  ciaImgUrl: {
    "CPFL": "https://crediconfiance.com.br/wp-content/uploads/2025/07/cpfl.png",
    "ENEL GO": "https://crediconfiance.com.br/wp-content/uploads/2025/07/enel-sp.png",
    "ENEL CE": "https://crediconfiance.com.br/wp-content/uploads/2025/07/enel-ce.png",
    "ENEL SP": "https://crediconfiance.com.br/wp-content/uploads/2025/07/enel-sp.png",
    "ENEL RJ": "https://crediconfiance.com.br/wp-content/uploads/2025/07/enel-rj.png",
    "RGE": "https://crediconfiance.com.br/wp-content/uploads/2025/07/rge.png",
  },

  getTips: function(cia, nomeCampo) {
    const keys = Object.keys(this.cia);
    const keyFound = keys.find(key => cia.toLowerCase().includes(key.toLowerCase()));
    if (!keyFound) return null;
    const campos = this.cia[keyFound];
    // Procura por sinônimo
    const campo = campos.find(c => c.nomes.some(n => nomeCampo.toLowerCase().includes(n.toLowerCase())));
    return campo ? campo.dica : null;
  },

  getCiaImgUrl: function(cia) {
    const keys = Object.keys(this.cia);
    const keyFound = keys.find(key => cia.toLowerCase().includes(key.toLowerCase()));
    if (!keyFound) return null;
    return this.ciaImgUrl[keyFound] || null;
  }
};

// FormValidator copiado do index.js
const FormValidator = {
  // Regras de validação para cada campo
  rules: {
    name: {
      required: true,
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
      messages: {
        required: "Nome é obrigatório",
        minLength: "Nome deve ter pelo menos 3 caracteres",
        maxLength: "Nome deve ter no máximo 100 caracteres",
        pattern: "Nome deve conter apenas letras",
      },
    },
    cpf: {
      required: true,
      pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      validate: (value) => FormValidator.validateCPF(value),
      messages: {
        required: "CPF é obrigatório",
        pattern: "CPF deve estar no formato 000.000.000-00",
        invalid: "CPF inválido",
      },
    },
    phone: {
      required: true,
      pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      messages: {
        required: "Telefone é obrigatório",
        pattern: "Telefone deve estar no formato (00) 00000-0000",
      },
    },
    birthdate: {
      required: true,
      pattern: /^\d{2}\/\d{2}\/\d{4}$/,
      validate: (value) => FormValidator.validateBirthdate(value),
      messages: {
        required: "Data de nascimento é obrigatória",
        pattern: "Data deve estar no formato DD/MM/AAAA",
        invalid: "Data de nascimento inválida",
        underage: "Você deve ter pelo menos 18 anos",
      },
    },
    cep: {
      required: true,
      pattern: /^\d{5}-?\d{3}$/,
      messages: {
        required: "CEP é obrigatório",
        pattern: "CEP deve ter 8 dígitos",
      },
    },
    // Campos do formulário de dados pessoais
    "nome-completo": {
      required: false, // Campo readonly, será preenchido automaticamente
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
      messages: {
        required: "Nome completo é obrigatório",
        minLength: "Nome deve ter pelo menos 3 caracteres",
        maxLength: "Nome deve ter no máximo 100 caracteres",
        pattern: "Nome deve conter apenas letras",
      },
    },
    sexo: {
      required: true,
      messages: {
        required: "Sexo é obrigatório",
      },
    },
    "nome-mae": {
      required: true,
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
      messages: {
        required: "Nome da mãe é obrigatório",
        minLength: "Nome deve ter pelo menos 3 caracteres",
        maxLength: "Nome deve ter no máximo 100 caracteres",
        pattern: "Nome deve conter apenas letras",
      },
    },
    "nome-conjuge": {
      required: false, // Campo opcional por padrão
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
      validate: function(value) {
        // Verifica se o estado civil é casado
        const estadoCivilSelect = document.getElementById('estado-civil');
        const isCasado = estadoCivilSelect && estadoCivilSelect.value === '1';
        
        if (isCasado && (!value || value.trim() === '')) {
          return { isValid: false, errorType: 'required' };
        }
        
        if (value && value.trim() !== '') {
          if (value.length < 3) {
            return { isValid: false, errorType: 'minLength' };
          }
          if (value.length > 100) {
            return { isValid: false, errorType: 'maxLength' };
          }
          if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
            return { isValid: false, errorType: 'pattern' };
          }
        }
        
        return { isValid: true };
      },
      messages: {
        required: "Nome do cônjuge é obrigatório para casados",
        minLength: "Nome deve ter pelo menos 3 caracteres",
        maxLength: "Nome deve ter no máximo 100 caracteres",
        pattern: "Nome deve conter apenas letras",
      },
    },
    // Campos do formulário de RG e naturalidade
    rg: {
      required: true,
      minLength: 5,
      maxLength: 20,
      pattern: /^[0-9]+$/,
      messages: {
        required: "RG é obrigatório",
        minLength: "RG deve ter pelo menos 5 dígitos",
        maxLength: "RG deve ter no máximo 20 dígitos",
        pattern: "RG deve conter apenas números",
      },
    },
    "rg-emissor": {
      required: true,
      messages: {
        required: "Órgão emissor é obrigatório",
      },
    },
    "rg-uf": {
      required: true,
      messages: {
        required: "UF do RG é obrigatório",
      },
    },
    "rg-emissao": {
      required: true,
      pattern: /^\d{2}\/\d{2}\/\d{4}$/,
      validate: (value) => FormValidator.validateEmissaoDate(value),
      messages: {
        required: "Data de emissão do RG é obrigatória",
        pattern: "Data deve estar no formato DD/MM/AAAA",
        invalid: "Data de emissão inválida",
        future: "Data de emissão não pode ser futura",
      },
    },
    "naturalidade-uf": {
      required: true,
      messages: {
        required: "Estado de naturalidade é obrigatório",
      },
    },
    "naturalidade-cidade": {
      required: true,
      messages: {
        required: "Cidade de naturalidade é obrigatória",
      },
    },
    // Campos do formulário de endereço
    "cep-endereco": {
      required: true,
      pattern: /^\d{5}-?\d{3}$/,
      messages: {
        required: "CEP é obrigatório",
        pattern: "CEP deve ter 8 dígitos",
      },
    },
    "logradouro-endereco": {
      required: true,
      minLength: 3,
      maxLength: 100,
      messages: {
        required: "Logradouro é obrigatório",
        minLength: "Logradouro deve ter pelo menos 3 caracteres",
        maxLength: "Logradouro deve ter no máximo 100 caracteres",
      },
    },
    "numero-endereco": {
      required: true,
      minLength: 1,
      maxLength: 10,
      pattern: /^[0-9A-Za-z]+$/,
      messages: {
        required: "Número é obrigatório",
        minLength: "Número deve ter pelo menos 1 caractere",
        maxLength: "Número deve ter no máximo 10 caracteres",
        pattern: "Número deve conter apenas números e letras",
      },
    },
    "bairro-endereco": {
      required: true,
      minLength: 3,
      maxLength: 50,
      messages: {
        required: "Bairro é obrigatório",
        minLength: "Bairro deve ter pelo menos 3 caracteres",
        maxLength: "Bairro deve ter no máximo 50 caracteres",
      },
    },
    "cidade-endereco": {
      required: true,
      minLength: 3,
      maxLength: 50,
      messages: {
        required: "Cidade é obrigatória",
        minLength: "Cidade deve ter pelo menos 3 caracteres",
        maxLength: "Cidade deve ter no máximo 50 caracteres",
      },
    },
    "estado-endereco": {
      required: true,
      messages: {
        required: "Estado é obrigatório",
      },
    },
    "complemento-endereco": {
      required: false,
      maxLength: 100,
      messages: {
        maxLength: "Complemento deve ter no máximo 100 caracteres",
      },
    },
    // Campos do formulário bancário
    "banco-id": {
      required: true,
      messages: {
        required: "Banco é obrigatório",
      },
    },
    "agencia-bancario": {
      required: true,
      minLength: 4,
      maxLength: 4,
      pattern: /^\d{4}$/,
      messages: {
        required: "Agência é obrigatória",
        minLength: "Agência deve ter 4 dígitos",
        maxLength: "Agência deve ter 4 dígitos",
        pattern: "Agência deve conter apenas números",
      },
    },
    "digito-bancario": {
      required: true,
      minLength: 1,
      maxLength: 2,
      pattern: /^\d{1,2}$/,
      messages: {
        required: "Dígito é obrigatório",
        minLength: "Dígito deve ter pelo menos 1 dígito",
        maxLength: "Dígito deve ter no máximo 2 dígitos",
        pattern: "Dígito deve conter apenas números",
      },
    },
    "numero-bancario": {
      required: true,
      minLength: 4,
      maxLength: 12,
      pattern: /^\d+$/,
      messages: {
        required: "Número da conta é obrigatório",
        minLength: "Número da conta deve ter pelo menos 4 dígitos",
        maxLength: "Número da conta deve ter no máximo 12 dígitos",
        pattern: "Número da conta deve conter apenas números",
      },
    },
    "tipo-conta-bancario": {
      required: true,
      messages: {
        required: "Tipo de conta é obrigatório",
      },
    },
  },

  // Valida um campo específico
  validateField: function (fieldName, value) {
    const rule = this.rules[fieldName];
    if (!rule) return { isValid: true, message: "" };

    // Verificar se é obrigatório
    if (rule.required && (!value || value.trim() === "")) {
      return { isValid: false, message: rule.messages.required };
    }

    // Se não é obrigatório e está vazio, é válido
    if (!rule.required && (!value || value.trim() === "")) {
      return { isValid: true, message: "" };
    }

    // Verificar comprimento mínimo
    if (rule.minLength && value.length < rule.minLength) {
      return { isValid: false, message: rule.messages.minLength };
    }

    // Verificar comprimento máximo
    if (rule.maxLength && value.length > rule.maxLength) {
      return { isValid: false, message: rule.messages.maxLength };
    }

    // Verificar padrão (regex)
    if (rule.pattern && !rule.pattern.test(value)) {
      return { isValid: false, message: rule.messages.pattern };
    }

    // Verificar validação customizada
    if (rule.validate) {
      const customValidation = rule.validate(value);
      if (!customValidation.isValid) {
        return {
          isValid: false,
          message:
            rule.messages[customValidation.errorType] ||
            customValidation.message,
        };
      }
    }

    return { isValid: true, message: "" };
  },

  // Valida um formulário completo
  validateForm: function (formData) {
    const errors = {};
    let isValid = true;

    for (const [fieldName, value] of Object.entries(formData)) {
      const validation = this.validateField(fieldName, value);
      if (!validation.isValid) {
        errors[fieldName] = validation.message;
        isValid = false;
      }
    }

    return { isValid, errors };
  },

  // Validação customizada de CPF
  validateCPF: function (cpf) {
    // Remove caracteres não numéricos
    const cleanCPF = cpf.replace(/\D/g, "");

    if (cleanCPF.length !== 11) {
      return { isValid: false, errorType: "pattern" };
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) {
      return { isValid: false, errorType: "invalid" };
    }

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) {
      return { isValid: false, errorType: "invalid" };
    }

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(10))) {
      return { isValid: false, errorType: "invalid" };
    }

    return { isValid: true };
  },

  // Validação de data de nascimento
  validateBirthdate: function (birthdate) {
    const [day, month, year] = birthdate.split("/").map(Number);

    // Verificar se a data é válida
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return { isValid: false, errorType: "invalid" };
    }

    // Verificar se é maior de idade
    const today = new Date();
    const age = today.getFullYear() - year;
    const monthDiff = today.getMonth() - (month - 1);
    const dayDiff = today.getDate() - day;

    if (
      age < 18 ||
      (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))
    ) {
      return { isValid: false, errorType: "underage" };
    }

    return { isValid: true };
  },

  // Formata CPF
  formatCPF: function (value) {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  },

  // Formata telefone
  formatPhone: function (value) {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
  },

  // Formata data de nascimento
  formatBirthdate: function (value) {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
  },

  // Formata CEP
  formatCEP: function (value) {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{5})(\d{3})/, "$1-$2");
  },

  // Valida data de emissão do RG
  validateEmissaoDate: function (value) {
    const [day, month, year] = value.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    const now = new Date();
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return { isValid: false, errorType: "invalid" };
    }
    if (date > now) {
      return { isValid: false, errorType: "future" };
    }
    return { isValid: true };
  },
};

// CepService copiado do index.js
const CepService = {
  CACHE_KEY: "cep_cache",

  getCache: function () {
    try {
      const cache = sessionStorage.getItem(this.CACHE_KEY);
      return cache ? JSON.parse(cache) : {};
    } catch (error) {
      console.error("Erro ao ler cache de CEP:", error);
      return {};
    }
  },

  saveToCache: function (cep, addressData) {
    try {
      const cache = this.getCache();
      cache[cep] = {
        data: addressData,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error("Erro ao salvar CEP no cache:", error);
    }
  },

  getFromCache: function (cep) {
    try {
      const cache = this.getCache();
      const cachedData = cache[cep];

      if (cachedData) {
        const now = Date.now();
        const cacheAge = now - cachedData.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 horas em millisegundos

        if (cacheAge < maxAge) {
          return cachedData.data;
        } else {
          delete cache[cep];
          sessionStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
        }
      }

      return null;
    } catch (error) {
      console.error("Erro ao ler CEP do cache:", error);
      return null;
    }
  },

  // Busca informações de endereço pelo CEP
  async searchAddressByCEP(cep) {
    try {
      // Remove caracteres não numéricos
      const cepLimpo = cep.replace(/\D/g, "");

      if (cepLimpo.length !== 8) {
        throw new Error("CEP deve ter 8 dígitos");
      }

      // Verifica cache primeiro
      const cachedAddress = this.getFromCache(cepLimpo);
      if (cachedAddress) {
        return {
          success: true,
          data: cachedAddress,
          fromCache: true,
        };
      }

      // Se não está no cache, busca na API
      const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erro ao buscar CEP");
      }

      const data = await response.json();

      if (data.erro) {
        throw new Error("CEP não encontrado");
      }

      const addressData = {
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
        cep: data.cep,
      };

      // Salva no cache
      this.saveToCache(cepLimpo, addressData);

      return {
        success: true,
        data: addressData,
        fromCache: false,
      };
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  async preencherEndereco(cep) {
    const resultado = await this.searchAddressByCEP(cep);

    if (resultado && resultado.success) {
      const endereco = resultado.data;
      return endereco;
    } else {
      const errorMessage = resultado ? resultado.error : "Erro ao buscar CEP";
      console.error("Erro ao buscar CEP:", errorMessage);
      return null;
    }
  },

  clearCache: function () {
    try {
      sessionStorage.removeItem(this.CACHE_KEY);
    } catch (error) {
      console.error("Erro ao limpar cache de CEP:", error);
    }
  },
};

// FormManager para gerenciar validação e eventos do formulário
const FormManager = {
  // Dados do endereço encontrado pelo CEP
  addressData: null,
  documentUploaded: sessionStorage.getItem('documentUploaded') ? true : false,

  setDocumentUploaded: function (value) {
    this.documentUploaded = value;
    sessionStorage.setItem('documentUploaded', value);
  },

  getDocumentUploaded: function () {
    return this.documentUploaded;
  },

  // Inicializa o formulário
  init: function () {
    
    // Restaura o estado salvo primeiro
    this.restoreFormState();
    
    this.setupFormatters();
    this.setupValidators();
    this.setupFormSubmission();
    this.setupResumoSubmission();
    this.setupDadosEnergiaSubmission();
    this.setupBackButtons();
    this.setupSpecialButtons();
    this.checkFormCompletion();
    
    // Verifica se há CEP preenchido e busca no cache
    this.checkSavedCEP();
    
    // Configura validação para o card de ofertas
    this.setupOffersValidation();
    this.setupUploadImagensSubmission();
    
    // Configura formulário de dados pessoais
    this.setupDadosPessoaisSubmission();
    
    // Configura formulário de RG e naturalidade
    this.setupRgNaturalidadeSubmission();
    
    // Configura formulário de endereço
    this.setupEnderecoSubmission();
    
    // Configura formulário bancário
    this.setupBancarioSubmission();
  },

  // Verifica se há CEP preenchido e busca no cache
  checkSavedCEP: function () {
    const cepInput = document.getElementById("cep");
    if (!cepInput || !cepInput.value) {
      return;
    }

    const cep = cepInput.value.replace(/\D/g, "");
    if (cep.length === 8) {
      const cachedAddress = CepService.getFromCache(cep);
      if (cachedAddress) {
        this.storeAddressData(cachedAddress);
        this.checkFormCompletion();
      } else {
        this.searchAddressByCEP(cep);
      }
    } else {
      console.log("❌ CEP incompleto para verificar cache:", cep);
    }
  },

  // Salva o estado do formulário no localStorage
  saveFormState: function () {
    try {
      const formData = this.collectFormData();
      const stateToSave = {
        formData: formData,
        addressData: this.addressData,
        timestamp: Date.now()
      };
      
      localStorage.setItem('form_state', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('❌ Erro ao salvar estado do formulário:', error);
    }
  },

  // Restaura o estado do formulário do localStorage
  restoreFormState: function () {
    try {
      const savedState = localStorage.getItem('form_state');
      if (!savedState) {
        return;
      }

      const state = JSON.parse(savedState);

      // Verifica se o estado não expirou (24 horas)
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 horas
      
      if (now - state.timestamp > maxAge) {
        localStorage.removeItem('form_state');
        return;
      }

      // Restaura os dados do formulário
      if (state.formData) {
        Object.keys(state.formData).forEach(fieldName => {
          const input = document.getElementById(fieldName);
          if (input && state.formData[fieldName]) {
            input.value = state.formData[fieldName];
          }
        });
      }

      // Restaura dados do endereço
      if (state.addressData) {
        this.storeAddressData(state.addressData);
      }

      // Verifica se o formulário está completo
      this.checkFormCompletion();
    } catch (error) {
      console.error('❌ Erro ao restaurar estado do formulário:', error);
    }
  },

  // Configura formatação automática dos campos
  setupFormatters: function () {
    // Formatação de CPF
    const cpfInput = document.getElementById("cpf");
    if (cpfInput) {
      cpfInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");

        if (value.length <= 3) {
          e.target.value = value;
        } else if (value.length <= 6) {
          e.target.value = value.slice(0, 3) + "." + value.slice(3);
        } else if (value.length <= 9) {
          e.target.value =
            value.slice(0, 3) +
            "." +
            value.slice(3, 6) +
            "." +
            value.slice(6);
        } else {
          e.target.value =
            value.slice(0, 3) +
            "." +
            value.slice(3, 6) +
            "." +
            value.slice(6, 9) +
            "-" +
            value.slice(9, 11);
        }
      });
    }

    // Formatação de telefone
    const phoneInput = document.getElementById("phone");
    if (phoneInput) {
      phoneInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");

        if (value.length <= 2) {
          e.target.value = value;
        } else if (value.length <= 6) {
          e.target.value = "(" + value.slice(0, 2) + ") " + value.slice(2);
        } else if (value.length <= 10) {
          e.target.value =
            "(" +
            value.slice(0, 2) +
            ") " +
            value.slice(2, 6) +
            "-" +
            value.slice(6);
        } else {
          e.target.value =
            "(" +
            value.slice(0, 2) +
            ") " +
            value.slice(2, 7) +
            "-" +
            value.slice(7, 11);
        }
      });
    }

    // Formatação de data de nascimento
    const birthdateInput = document.getElementById("birthdate");
    if (birthdateInput) {
      birthdateInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");

        if (value.length <= 2) {
          e.target.value = value;
        } else if (value.length <= 4) {
          e.target.value = value.slice(0, 2) + "/" + value.slice(2);
        } else {
          e.target.value =
            value.slice(0, 2) +
            "/" +
            value.slice(2, 4) +
            "/" +
            value.slice(4, 8);
        }
      });
    }

    // Formatação de CEP
    const cepInput = document.getElementById("cep");
    if (cepInput) {
      cepInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");

        if (value.length <= 5) {
          e.target.value = value;
        } else {
          e.target.value = value.slice(0, 5) + "-" + value.slice(5, 8);
        }
      });
    }
  },

  // Configura validação em tempo real
  setupValidators: function () {
    const allFields = ["name", "cpf", "phone", "birthdate", "cep", "checkbox-titular"];

    allFields.forEach((fieldName) => {
      const input = document.getElementById(fieldName);
      if (input) {
        // Validação em tempo real
        input.addEventListener("blur", (e) => {
          this.validateField(fieldName, e.target.value);
        });

        // Limpar erro quando começar a digitar
        input.addEventListener("input", (e) => {
          this.clearFieldError(fieldName);
          this.checkFormCompletion();
          this.saveFormState();
        });
      }
    });

    // Configura busca automática de CEP
    this.setupCEPSearch();
  },

  // Verifica se o formulário está completo e habilita/desabilita botão
  checkFormCompletion: function () {
    const card = document.querySelector('[data-card-id="formulario"]');
    if (!card) return;

    const nextBtn = card.querySelector(".next-btn");
    if (!nextBtn) return;

    const isComplete = this.isFormComplete();
    this.toggleButton(nextBtn, isComplete);
  },

  // Verifica se o formulário está completo
  isFormComplete: function () {
    const formData = this.collectFormData();
    // Valida formulário
    const validation = FormValidator.validateForm(formData);
    const checkbox = document.getElementById("checkbox-titular");
    
    if (!validation.isValid || !checkbox.checked) {
      return false;
    }
  
    // Validação adicional para dados do endereço
    if (
      !this.addressData ||
      !this.addressData.cidade ||
      !this.addressData.estado
    ) {
      return false;
    }

    return true;
  },

  // Habilita ou desabilita botão
  toggleButton: function (button, enabled) {
    if (enabled) {
      button.disabled = false;
      button.classList.remove("disabled");
      button.style.opacity = "1";
      button.style.cursor = "pointer";
    } else {
      button.disabled = true;
      button.classList.add("disabled");
      button.style.opacity = "0.5";
      button.style.cursor = "not-allowed";
    }
  },

  // Configura busca automática de CEP
  setupCEPSearch: function () {
    const cepInput = document.getElementById("cep");
    if (!cepInput) return;

    let timeoutId = null;

    cepInput.addEventListener("input", (e) => {
      const cep = e.target.value.replace(/\D/g, "");

      // Limpa timeout anterior
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Se o CEP tem 8 dígitos, busca automaticamente
      if (cep.length === 8) {
        timeoutId = setTimeout(async () => {
          await this.searchAddressByCEP(cep);
        }, 500); // Aguarda 500ms após parar de digitar
      } else {
        // Se o CEP não tem 8 dígitos, limpa os dados do endereço
        this.clearAddressData();
      }
    });

    // Limpa dados quando o campo é limpo
    cepInput.addEventListener("change", (e) => {
      const cep = e.target.value.replace(/\D/g, "");
      if (cep.length === 0) {
        this.clearAddressData();
      }
    });
  },

  // Busca endereço por CEP
  async searchAddressByCEP(cep) {
    const cepInput = document.getElementById("cep");
    if (!cepInput) return;

    // Mostra indicador de carregamento
    cepInput.classList.add("cep-loading");

    try {
      const resultado = await CepService.preencherEndereco(cep);

      if (resultado) {
        // Remove indicador de carregamento
        cepInput.classList.remove("cep-loading");

        // Mostra sucesso visual
        cepInput.classList.add("cep-success");

        // Remove sucesso visual após 2 segundos
        setTimeout(() => {
          cepInput.classList.remove("cep-success");
        }, 2000);

        // Armazena os dados do endereço
        this.storeAddressData(resultado);

        // Verifica se o formulário está completo após encontrar o CEP
        this.checkFormCompletion();
      } else {
        // Se não encontrou o endereço, limpa os dados
        this.clearAddressData();
        this.showFieldError("cep", "CEP não encontrado ou inválido");
      }
    } catch (error) {
      // Remove indicador de carregamento
      cepInput.classList.remove("cep-loading");
      console.error("Erro ao buscar CEP:", error);

      // Limpa dados do endereço em caso de erro
      this.clearAddressData();

      // Verifica estado do formulário mesmo em caso de erro
      this.checkFormCompletion();
    }
  },

  // Valida um campo e mostra erro se necessário
  validateField: function (fieldName, value) {
    const validation = FormValidator.validateField(fieldName, value);
    const input = document.getElementById(fieldName);

    if (!input) return;

    if (!validation.isValid) {
      this.showFieldError(fieldName, validation.message);
      return false;
    } else {
      this.clearFieldError(fieldName);
      return true;
    }
  },

  // Mostra erro de um campo
  showFieldError: function (fieldName, message) {
    const input = document.getElementById(fieldName);
    if (!input) return;

    // Remove erro anterior
    this.clearFieldError(fieldName);

    // Adiciona classe de erro
    input.classList.add("error");

    // Cria ou atualiza mensagem de erro
    let errorElement = input.parentElement.querySelector(".error-message");
    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.className = "error-message";
      input.parentElement.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.display = "block";
  },

  // Remove erro de um campo
  clearFieldError: function (fieldName) {
    const input = document.getElementById(fieldName);
    if (!input) return;

    input.classList.remove("error");

    const errorElement = input.parentElement.querySelector(".error-message");
    if (errorElement) {
      errorElement.style.display = "none";
    }
  },

  // Configura submissão do formulário
  setupFormSubmission: function () {
    // Intercepta cliques no botão "Avançar" do formulário
    const formularioCard = document.querySelector('[data-card-id="formulario"]');
    if (!formularioCard) return;

    const nextBtn = formularioCard.querySelector(".next-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleFormSubmission();
      });
    }

    // Intercepta cliques no botão "Avançar" do card de ofertas
    const ofertasCard = document.querySelector('[data-card-id="ofertas"]');
    if (!ofertasCard) return;

    const ofertasNextBtn = ofertasCard.querySelector(".next-btn");
    if (ofertasNextBtn) {
      ofertasNextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleOffersSubmission();
      });
    }
    
  },

  // Processa submissão do formulário
  handleFormSubmission: function () {
    const formData = this.collectFormData();
    
    flowManager.data.updateUserData({
      cpf: formData.cpf,
      nome: formData.name,
      nascimento: formData.birthdate,
      telefone: formData.phone,
      cep: formData.cep,
      cidade: this.addressData.cidade,
      estado: this.addressData.estado,
    });
    this.clearFormState();
    flowManager.executeSimulationFlow();
  },

  // Coleta dados do formulário
  collectFormData: function () {
    const formData = {};
    const fields = ["name", "cpf", "phone", "birthdate", "cep"];

    fields.forEach((fieldName) => {
      const input = document.getElementById(fieldName);
      if (input) {
        formData[fieldName] = input.value.trim();
      }
    });

    return formData;
  },

  // Armazena dados do endereço encontrado pelo CEP
  storeAddressData: function (addressData) {
    this.addressData = addressData;
    // Salva o estado após atualizar os dados do endereço
    this.saveFormState();
  },

  // Limpa dados do endereço
  clearAddressData: function () {
    this.addressData = null;
    // Verifica se o formulário ainda está completo
    this.checkFormCompletion();
  },

  // Limpa o estado salvo do formulário
  clearFormState: function () {
    try {
      localStorage.removeItem('form_state');
    } catch (error) {
      console.error('❌ Erro ao limpar estado do formulário:', error);
    }
  },

  // Configura validação para o card de ofertas
  setupOffersValidation: function () {
    const ofertasCard = document.querySelector('[data-card-id="ofertas"]');
    if (!ofertasCard) return;

    const nextBtn = ofertasCard.querySelector(".next-btn");
    if (!nextBtn) return;

    // Sempre habilita o botão, pois sempre temos um valor selecionado por padrão
    this.toggleButton(nextBtn, true);
  },

  // Processa submissão do card de ofertas
  handleOffersSubmission: function () {
    flowManager.ui.transitionBetweenCards('resumo', 1);
  },

  // Configura submissão do card de resumo
  setupResumoSubmission: function () {
    const resumoCard = document.querySelector('[data-card-id="resumo"]');
    if (!resumoCard) return;

    const nextBtn = resumoCard.querySelector(".next-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleResumoSubmission();
      });
    }
  },

  // Processa submissão do card de resumo
  handleResumoSubmission: function () {
    // flowManager.ui.transitionBetweenCards('dados-energia', 1);
    this.saveProposal();
  },

  // Configura botões de voltar para todos os cards
  setupBackButtons: function () {
    // Botão voltar do card de ofertas
    const ofertasCard = document.querySelector('[data-card-id="ofertas"]');
    if (ofertasCard) {
      const backBtn = ofertasCard.querySelector(".back-btn");
      if (backBtn) {
        backBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleBackFromOffers();
        });
      }
    }

    // Botão voltar do card de resumo
    const resumoCard = document.querySelector('[data-card-id="resumo"]');
    if (resumoCard) {
      const backBtn = resumoCard.querySelector(".back-btn");
      if (backBtn) {
        backBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleBackFromResumo();
        });
      }
    }

    // Botão voltar do card de dados de energia
    const dadosEnergiaCard = document.querySelector('[data-card-id="dados-energia"]');
    if (dadosEnergiaCard) {
      const backBtn = dadosEnergiaCard.querySelector(".back-btn");
      if (backBtn) {
        backBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleBackFromDadosEnergia();
        });
      }
    }

    // Botão "Tentar Novamente" do card de reprovado
    const reprovadoCard = document.querySelector('[data-card-id="reprovado"]');
    if (reprovadoCard) {
      const backBtn = reprovadoCard.querySelector("#btn-reprovado-entendi");
      if (backBtn) {
        backBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleBackFromReprovado();
        });
      }

      // Botão "Falar com Consultor" do card de reprovado
      const consultorBtn = reprovadoCard.querySelector("#btn-reprovado-falar");
      if (consultorBtn) {
        consultorBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleFalarComConsultor();
        });
      }
    }

    // Botão "Voltar ao Início" do card de em análise
    const emAnaliseCard = document.querySelector('[data-card-id="em-analise"]');
    if (emAnaliseCard) {
      const backBtn = emAnaliseCard.querySelector(".back-btn");
      if (backBtn) {
        backBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleBackFromEmAnalise();
        });
      }
    }

    // Botão voltar do card de rg e naturalidade
    const formularioRgNaturalidadeCard = document.querySelector('[data-card-id="formulario-rg-naturalidade"]');
    if (formularioRgNaturalidadeCard) {
      const backBtn = formularioRgNaturalidadeCard.querySelector(".back-btn");
      if (backBtn) {
        backBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleBackFromFormularioRgNaturalidade();
        });
      }
    }

    // Botão voltar do card de endereço
    const formularioEnderecoCard = document.querySelector('[data-card-id="formulario-endereco"]');
    if (formularioEnderecoCard) {
      const backBtn = formularioEnderecoCard.querySelector(".back-btn");
      if (backBtn) {
        backBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleBackFromFormularioEndereco();
        });
      }
    }

    // Botão voltar do card de dados bancários
    const formularioBancarioCard = document.querySelector('[data-card-id="formulario-bancario"]');
    if (formularioBancarioCard) {
      const backBtn = formularioBancarioCard.querySelector(".back-btn");
      if (backBtn) {
        backBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleBackFromFormularioBancario();
        });
      }
    }

    // Botão voltar do card de upload de imagens
    const uploadImagensCard = document.querySelector('[data-card-id="upload-imagens"]');
    if (uploadImagensCard) {
      const backBtn = uploadImagensCard.querySelector(".back-btn");
      if (backBtn) {
        backBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleBackFromUploadImagens();
        });
      }
    }
  },

  // Configura botões especiais dos cards
  setupSpecialButtons: function () {
    // Botão "Aguardar Consultor" do card de sucesso
    const sucessoCard = document.querySelector('[data-card-id="sucesso"]');
    if (sucessoCard) {
      const aguardarBtn = sucessoCard.querySelector("#btn-aguardar");
      if (aguardarBtn) {
        aguardarBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleBackFromSucesso();
        });
      }

      // Botão "Continuar Agora" do card de sucesso
      const continuarAgoraBtn = sucessoCard.querySelector("#btn-continuar-agora");
      if (continuarAgoraBtn) {
        continuarAgoraBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const userData = flowManager.data.getDataForRequest("simulation");
          Utils.preencherFormularioFinalComEstado(userData);
          this.handleContinueFromSucesso();
        });
      }
    }

    // Botão "Entendi" do card finalizar-parcial
    const finalizarCard = document.querySelector('[data-card-id="finalizar-parcial"]');
    if (finalizarCard) {
      const finalizarBtn = finalizarCard.querySelector("#btn-finalizar");
      if (finalizarBtn) {
        finalizarBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleBackFromFinalizar();
        });
      }
    }

    // Botão "Continuar Agora" do card continuar
    const continuarCard = document.querySelector('[data-card-id="continuar"]');
    if (continuarCard) {
      const continuarBtn = continuarCard.querySelector("#btn-continuar");
      if (continuarBtn) {
        continuarBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleContinueFromContinuar();
        });
      }
    }

    // Botões do card cancelado
    const canceladoCard = document.querySelector('[data-card-id="cancelado"]');
    if(canceladoCard) {
      // Botão "Refazer Simulação" do card cancelado
      const refazerBtn = canceladoCard.querySelector("#btn-refazer-simulacao");
      if (refazerBtn) {
        refazerBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleRefazerSimulacao();
        });
      }
      // Botão "Finalizar Vazio" do card cancelado
      const finalizarVazioBtn = canceladoCard.querySelector("#btn-finalizar-vazio");
      if (finalizarVazioBtn) {
        finalizarVazioBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleFinalizarVazio();
        });
      }
    }

    // Botão "Entendi" do card não encontrado
    const naoEncontradaCard = document.querySelector('[data-card-id="nao-encontrada"]');
    if (naoEncontradaCard) {
      const entendiBtn = naoEncontradaCard.querySelector("#btn-nao-encontrada-entendi");
      if (entendiBtn) {
        entendiBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleEntendiNaoEncontrada();
        });
      }
    }    
    // Botão "Entendi" do card obrigado
    const obrigadoCard = document.querySelector('[data-card-id="obrigado"]');
    if (obrigadoCard) {
      const obrigadoBtn = obrigadoCard.querySelector("#btn-obrigado-entendi");
      if (obrigadoBtn) {
        obrigadoBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleBackFromObrigado();
        });
      }
    }

    // Botão "Tentar Novamente" do card erro-final
    const erroFinalCard = document.querySelector('[data-card-id="erro-final"]');
    if (erroFinalCard) {
      const tentarNovamenteBtn = erroFinalCard.querySelector("#btn-retry-final");
      if (tentarNovamenteBtn) {
        tentarNovamenteBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleRetryFinal();
        });
      }
    }

    // Botão "Finalizar" do card erro-final
    const finalizarBtn = erroFinalCard.querySelector("#btn-finalizar-erro");
    if (finalizarBtn) {
      finalizarBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleFinalizarErro();
      });
    }

    // Botões do card dados-energia-invalidos
    const dadosEnergiaInvalidosCard = document.querySelector('[data-card-id="dados-energia-invalidos"]');
    if (dadosEnergiaInvalidosCard) {
      // Botão "Tentar Novamente" do card dados-energia-invalidos
      const tentarNovamenteBtn = dadosEnergiaInvalidosCard.querySelector("#btn-tentar-novamente");
      if (tentarNovamenteBtn) {
        tentarNovamenteBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleTentarNovamenteEnergia();
        });
      }

      // Botão "Voltar ao Formulário" do card dados-energia-invalidos
      const voltarFormularioBtn = dadosEnergiaInvalidosCard.querySelector("#btn-voltar-formulario");
      if (voltarFormularioBtn) {
        voltarFormularioBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleVoltarFormularioEnergia();
        });
      }
    }
  },

  // Handlers para botões de voltar
  handleBackFromOffers: function () {
    
    // Volta para o formulário
    flowManager.ui.transitionBetweenCards('formulario', -1);
  },

  handleBackFromResumo: function () {
    
    // Volta para o card de ofertas
    flowManager.ui.transitionBetweenCards('ofertas', -1);
  },

  handleBackFromDadosEnergia: function () {
    
    // Volta para o card de resumo
    flowManager.ui.transitionBetweenCards('resumo', -1);
  },

  handleBackFromReprovado: function () {
    
    Utils.limparFormularioPrincipal();
    this.clearFormState();
    // Volta para o formulário
    flowManager.ui.transitionBetweenCards('formulario', -1);
  },

  handleBackFromEmAnalise: function () {
    
    // Remove a proposta do localStorage e volta para o formulário
    ProposalStorageManager.clearProposalId();
    Utils.limparFormularioPrincipal();
    this.clearFormState();
    flowManager.ui.transitionBetweenCards('formulario', 1);
  },

  handleFalarComConsultor: function () {
    // abrir whatsapp
    const whatsappUrl = document.querySelector('span[data-wts-url]')?.getAttribute('data-wts-url');
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank');
    }

    // limpar formulario
    Utils.limparFormularioPrincipal();
    this.clearFormState();
    ProposalStorageManager.clearProposalId();
    
    // Navega para o card finalizar-parcial
    flowManager.ui.transitionBetweenCards('formulario', 1);
  },

  handleBackFromSucesso: function () {
    
    // Navega para o card finalizar-parcial
    flowManager.ui.transitionBetweenCards('finalizar-parcial', 1);
  },

  handleBackFromFinalizar: function () {
    // limpar formulario final
    Utils.limparFormularioFinal();
    this.clearFormState();
    ProposalStorageManager.clearProposalId();
    
    // Volta para o formulário
    flowManager.ui.transitionBetweenCards('formulario', -1);
  },

  handleContinueFromSucesso: function () {
    
    // Navega para o card de dados de energia
    flowManager.ui.transitionBetweenCards('formulario-dados-pessoais', 1);
  },

  handleContinueFromContinuar: function () {
    
    // Executa o fluxo de continuação a partir da proposta salva
    flowManager.continueFromSavedProposal().then(result => {
      if (!result.success) {
        console.error('❌ Erro ao continuar fluxo:', result.error);
        // Em caso de erro, volta para o formulário
        switch (result.error) {
          case 'Proposta cancelada':
            flowManager.ui.transitionBetweenCards('cancelado', 1);
            break;
          case 'Nenhuma proposta válida encontrada':
            flowManager.ui.transitionBetweenCards('nao-encontrada', 1);
            break;
          case 'Falha ao tentar buscar ofertas e parcelas':
            flowManager.ui.transitionBetweenCards('erro-final', 1);
            break;
          case 'Produto energia não disponível':
            flowManager.ui.transitionBetweenCards('reprovado', 1);
            break;
          default:
          flowManager.ui.transitionBetweenCards('formulario', 1);
        }
      }
    });
  },

  handleBackFromObrigado: function () {
    // limpar proposal
    Utils.limparFormularioFinal();
    this.clearFormState();
    ProposalStorageManager.clearProposalId();
    
    // Volta para o formulário
    flowManager.ui.transitionBetweenCards('formulario', -1);
  },

  handleFinalizarVazio: function () {
    // Volta para o formulário
    Utils.limparFormularioPrincipal();
    this.clearFormState();
    ProposalStorageManager.clearProposalId();

    flowManager.ui.transitionBetweenCards('formulario', 1);
  },

  handleEntendiNaoEncontrada: function () { 
    
    // Volta para o formulário
    Utils.limparFormularioPrincipal();
    this.clearFormState();
    ProposalStorageManager.clearProposalId();

    flowManager.ui.transitionBetweenCards('formulario', 1);
  },

  handleRefazerSimulacao: function () {
    
    // Volta para o formulário
    Utils.preencherFormularioComDataManager(flowManager.data);
    flowManager.ui.transitionBetweenCards('formulario', 1);
  },

  handleBackFromUploadImagens: function () {
    // Volta para o card de dados bancários
    flowManager.ui.transitionBetweenCards('formulario-bancario', -1);
  },

  handleBackFromFormularioBancario: function () {
    
    // Volta para o card de endereço
    flowManager.ui.transitionBetweenCards('formulario-endereco', -1);
  },

  handleBackFromFormularioEndereco: function () {
    
    // Volta para o card de dados bancários
    flowManager.ui.transitionBetweenCards('formulario-rg-naturalidade', -1);
  },

  handleBackFromFormularioRgNaturalidade: function () {
    
    // Volta para o card de dados bancários
    flowManager.ui.transitionBetweenCards('formulario-dados-pessoais', -1);
  },

  handleRetryFinal: function () {
    
    // Volta para o formulário
    retryManager.retryLast();
  },

  handleFinalizarErro: function () {
    
    // Volta para o formulário
    flowManager.ui.transitionBetweenCards('formulario', 1);
  },

  handleTentarNovamenteEnergia: function () {
    
    // Volta para o card de dados da energia
    flowManager.ui.transitionBetweenCards('dados-energia', 1);
  },

  handleVoltarFormularioEnergia: function () {
    // limpar formulario
    Utils.limparFormularioPrincipal();
    this.clearFormState();
    ProposalStorageManager.clearProposalId();
    
    // Volta para o formulário principal
    flowManager.ui.transitionBetweenCards('formulario', 1);
  },

  // Configura submissão do card de dados de energia
  setupDadosEnergiaSubmission: function () {
    const dadosEnergiaCard = document.querySelector('[data-card-id="dados-energia"]');
    if (!dadosEnergiaCard) return;

    const nextBtn = dadosEnergiaCard.querySelector(".next-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleDadosEnergiaSubmission();
      });
    }

    // Configura validação em tempo real dos campos
    this.setupDadosEnergiaValidation();
    
    // Verifica estado inicial do botão
    this.checkDadosEnergiaCompletion();
  },

  // Configura validação dos campos de dados de energia
  setupDadosEnergiaValidation: function () {
    // Configura validação para campos estáticos
    const numeroContaInput = document.getElementById("numero-da-conta");
    const codigoSegurancaInput = document.getElementById("codigo-de-seguranca");

    if (numeroContaInput) {
      numeroContaInput.addEventListener("input", () => {
        this.checkDadosEnergiaCompletion();
      });
    }

    if (codigoSegurancaInput) {
      codigoSegurancaInput.addEventListener("input", () => {
        this.checkDadosEnergiaCompletion();
      });
    }

    // Configura validação para campos dinâmicos (se existirem)
    const dadosEnergiaCard = document.querySelector('[data-card-id="dados-energia"]');
    if (dadosEnergiaCard) {
      const dynamicInputs = dadosEnergiaCard.querySelectorAll('input[data-convenio-dados-id]');
      const dynamicSelects = dadosEnergiaCard.querySelectorAll('select[data-convenio-dados-id]');
      
      // Configura eventos para campos de texto
      dynamicInputs.forEach(input => {
        input.addEventListener("input", () => {
          this.checkDadosEnergiaCompletion();
        });
        
        input.addEventListener("blur", () => {
          this.checkDadosEnergiaCompletion();
        });
      });

      // Configura eventos para campos de data (selects)
      dynamicSelects.forEach(select => {
        select.addEventListener("change", () => {
          this.checkDadosEnergiaCompletion();
        });
      });
    }
  },

  // Verifica se os dados de energia estão completos
  checkDadosEnergiaCompletion: function () {
    const dadosEnergiaCard = document.querySelector('[data-card-id="dados-energia"]');
    if (!dadosEnergiaCard) return;

    const nextBtn = dadosEnergiaCard.querySelector(".next-btn");
    if (!nextBtn) return;

    // Verifica se há campos dinâmicos
    const dynamicInputs = dadosEnergiaCard.querySelectorAll('input[data-convenio-dados-id]');
    const dynamicSelects = dadosEnergiaCard.querySelectorAll('select[data-convenio-dados-id]');
    
    if (dynamicInputs.length > 0 || dynamicSelects.length > 0) {
      let allValid = true;
      
      dynamicInputs.forEach(input => {
        const valor = input.value.trim();
        if (!valor) {
          allValid = false;
        }
      });
      
      // Valida campos de data (selects)
      if (dynamicSelects.length > 0) {
        const dateFields = this.groupDateSelects(dynamicSelects);
        dateFields.forEach(dateField => {
          if (!dateField.dia || !dateField.mes) {
            allValid = false;
          }
        });
      }
      
      this.toggleButton(nextBtn, allValid);
    } else {
      // Valida campos estáticos
      const numeroConta = document.getElementById("numero-da-conta")?.value?.trim();
      const codigoSeguranca = document.getElementById("codigo-de-seguranca")?.value?.trim();
      const isComplete = numeroConta && codigoSeguranca;
      this.toggleButton(nextBtn, isComplete);
    }
  },

  // Processa submissão do card de dados de energia
  handleDadosEnergiaSubmission: function () { 
    
    // Verifica se há campos dinâmicos
    const cardDadosEnergia = document.querySelector('[data-card-id="dados-energia"]');
    const dynamicInputs = cardDadosEnergia?.querySelectorAll('input[data-convenio-dados-id]');
    const dynamicSelects = cardDadosEnergia?.querySelectorAll('select[data-convenio-dados-id]');
    
    if (dynamicInputs.length > 0 || dynamicSelects.length > 0) {
      // Usa campos dinâmicos
      const dynamicData = this.collectDynamicFieldsData();
      
      if (dynamicData.length === 0) {
        console.log('❌ Nenhum dado coletado dos campos dinâmicos');
        return;
      }
      
      // Atualiza dados adicionais no DataManager
      flowManager.data.updateUserAdditionalData({
        adicionais: dynamicData
      });
      
    } else {
      // Usa campos estáticos (fallback)
      const numeroConta = document.getElementById("numero-da-conta")?.value?.trim();
      const codigoSeguranca = document.getElementById("codigo-de-seguranca")?.value?.trim();
      
      if (!numeroConta || !codigoSeguranca) {
        console.log('❌ Campos estáticos não preenchidos');
        return;
      }
      
      // Atualiza dados adicionais no DataManager
      flowManager.data.updateUserAdditionalData({
        adicionais: [
          { campo: "numeroConta", valor: numeroConta },
          { campo: "codigoSeguranca", valor: codigoSeguranca }
        ]
      });
    }

    // Salva a proposta
    // this.saveProposal();

    flowManager.executeEnergyDataFlow();

    this.clearFormState();
  },

  // Coleta dados dos campos dinâmicos
  collectDynamicFieldsData: function () {
    const cardDadosEnergia = document.querySelector('[data-card-id="dados-energia"]');
    if (!cardDadosEnergia) return [];

    const inputs = cardDadosEnergia.querySelectorAll('input[data-convenio-dados-id]');
    const selects = cardDadosEnergia.querySelectorAll('select[data-convenio-dados-id]');
    const dados = [];

    // Processa campos de texto normais
    inputs.forEach(input => {
      const convenioDadosId = parseInt(input.dataset.convenioDadosId);
      const valor = input.value.trim();

      if (valor) {
        dados.push({
          valor: valor,
          convenioDadosId: convenioDadosId,
          convenioId: flowManager.data.getDataForRequest('saveProposal').convenioId
        });
      }
    });

    // Processa campos de data (selects)
    const dateFields = this.groupDateSelects(selects);
    dateFields.forEach(dateField => {
      if (dateField.dia && dateField.mes) {
        // Formata a data usando o ano de vencimento
        const formattedDate = this.formatDateWithVencimentoYear(dateField.dia, dateField.mes);
        
        dados.push({
          valor: formattedDate,
          convenioDadosId: dateField.convenioDadosId,
          convenioId: flowManager.data.getDataForRequest('saveProposal').convenioId
        });
      }
    });

    return dados;
  },

  // Agrupa selects de data por convenioDadosId
  groupDateSelects: function (selects) {
    const dateFields = {};
    
    selects.forEach(select => {
      const convenioDadosId = parseInt(select.dataset.convenioDadosId);
      const fieldType = select.dataset.fieldType; // 'date-dia' ou 'date-mes'
      
      if (!dateFields[convenioDadosId]) {
        dateFields[convenioDadosId] = {
          convenioDadosId: convenioDadosId,
          dia: null,
          mes: null
        };
      }
      
      if (fieldType === 'date-dia') {
        dateFields[convenioDadosId].dia = select.value;
      } else if (fieldType === 'date-mes') {
        dateFields[convenioDadosId].mes = select.value;
      }
    });
    
    return Object.values(dateFields);
  },

  // Formata data usando o ano de vencimento
  formatDateWithVencimentoYear: function (dia, mes) {
    // Obtém o ano de vencimento do DataManager
    const vencimento = flowManager.data.getDataForRequest('saveProposal').vencimento;
    
    if (vencimento) {
      // Extrai o ano da data de vencimento
      const vencimentoDate = new Date(vencimento);
      const ano = vencimentoDate.getFullYear();
      
      // Formata como YYYY-MM-DD
      return `${ano}-${mes}-${dia}`;
    } else {
      // Fallback: usa o ano atual
      const anoAtual = new Date().getFullYear();
      return `${anoAtual}-${mes}-${dia}`;
    }
  },

  // Salva a proposta na API
  async saveProposal() {
    try {
      flowManager.ui.resetCardLoading('salvar');
      
      // Mostra loading específico para salvar
      flowManager.ui.transitionBetweenCards('loading-salvar', 1);
      flowManager.ui.animateCardLoading(0, 'salvar');
      
      const data = flowManager.data.getDataForRequest('saveProposal');
      const result = await flowManager.api.retry(
        () => flowManager.api.updateProposal(data)        
      );
      
      // Anima o próximo passo do loading
      flowManager.ui.animateCardLoading(1, 'salvar');
      
      if (result.success) {
        
        // Remove a proposta do localStorage quando finalizada com sucesso
        // ProposalStorageManager.clearProposalId();
        // Anima o último passo do loading
        flowManager.ui.animateCardLoading(2, 'salvar');
        
        // Navega para o card de sucesso (agendado automaticamente)
        flowManager.ui.transitionBetweenCards('sucesso', 1);

        SimulationStep.save(SimulationStep.WAITING_SUBMISSION);
      } else {
        console.error('❌ Erro ao salvar proposta:', result.error);
        // Em caso de erro, vai para reprovado (agendado automaticamente)
        flowManager.ui.transitionBetweenCards('reprovado', 1);
      }
    } catch (error) {
      console.error('❌ Erro ao salvar proposta:', error);
      flowManager.ui.transitionBetweenCards('reprovado', 1);
    }
  },

  // Processa submissão do card de upload de imagens
  setupUploadImagensSubmission: function () {
    const uploadImagensCard = document.querySelector('[data-card-id="upload-imagens"]');
    if (!uploadImagensCard) {
      return;
    }

    const nextBtn = uploadImagensCard.querySelector(".next-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleUploadImagensSubmission();
      });
    } else {
    }

    // Configura validação em tempo real dos uploads
    this.setupUploadImagensValidation();
    
    // Verifica estado inicial do botão
    this.checkUploadImagensCompletion();
  },

  // Configura validação dos uploads
  setupUploadImagensValidation: function () {
    const uploadInputs = [
      { id: 'upload-conta-luz', type: 'contaLuz' },
      { id: 'upload-id-frente', type: 'idFrente' },
      { id: 'upload-id-verso', type: 'idVerso' }
    ];

    uploadInputs.forEach(({ id, type }) => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (file) {
            // Atualiza o documento no DataManager
            flowManager.data.updateUserDocument(type, file);
          } else {
            // Remove o documento se não há arquivo
            flowManager.data.updateUserDocument(type, null);
          }
          
          // Verifica se todos os documentos estão completos
          this.checkUploadImagensCompletion();
        });
      }
    });
  },

  // Verifica se todos os uploads de imagens estão completos
  checkUploadImagensCompletion: function () {
    const uploadImagensCard = document.querySelector('[data-card-id="upload-imagens"]');
    if (!uploadImagensCard) return;

    const nextBtn = uploadImagensCard.querySelector(".next-btn");
    if (!nextBtn) return;

    const areComplete = flowManager.data.areDocumentsComplete();
    this.toggleButton(nextBtn, areComplete);
    
  },

  // Processa submissão do card de upload de imagens
  handleUploadImagensSubmission: function () {
    
    // Verifica se todos os documentos estão completos
    if (!flowManager.data.areDocumentsComplete()) {
      console.log('❌ Documentos incompletos');
      return;
    }

    // Inicia o processo de upload e envio da proposta
    this.executeFinalSubmission();
  },

  // Executa o processo final de upload e envio da proposta
  async executeFinalSubmission() {
    try {
      
      // Mostra o card de loading final
      flowManager.ui.transitionBetweenCards('loading-final', 1);
      flowManager.ui.resetCardLoading('final');
      flowManager.ui.animateCardLoading(0, 'final');
      
      // Passo 1: Validar documentos (simulado)
      await Utils.sleep(1500);
      flowManager.ui.animateCardLoading(1, 'final');

      // Se não tiver feito o upload de documentos, faz o upload.
      // Caso tenha feito, pula para o próximo passo.
      // Util para caso aconteça um erro após fazer o upload de documentos.
      if(!this.getDocumentUploaded()) {
        // Passo 2: Fazer upload dos documentos
        const imagesUploaded = await this.uploadDocuments();
        if(!imagesUploaded) {
          console.error('❌ Erro ao fazer upload dos documentos');
          // Registra a operação para tentar novamente
          retryManager.register(this.executeFinalSubmission.bind(this));
          Utils.setErrorMessageToFinalErrorCard('Falha ao fazer upload dos documentos');
          flowManager.ui.transitionBetweenCards('erro-final', 1);
          return;
        }
        this.setDocumentUploaded(true);
      }

      flowManager.ui.animateCardLoading(2, 'final');
      
      // Passo 3: Enviar proposta para análise
      const result = await this.submitProposalToAnalysis();

      if(!result) {
        console.error('❌ Erro ao enviar proposta para análise');
        // Registra a operação para tentar novamente
        retryManager.register(this.executeFinalSubmission.bind(this));
        Utils.setErrorMessageToFinalErrorCard('Falha ao enviar proposta para análise');
        flowManager.ui.transitionBetweenCards('erro-final', 1);
        return;
      }

      flowManager.ui.animateCardLoading(3, 'final');
      
      // Passo 4: Finalizar processo
      await Utils.sleep(1000);
      flowManager.ui.animateCardLoading(4, 'final');

      // Limpa id da proposta
      // ProposalStorageManager.clearProposalId()

      SimulationStep.save(SimulationStep.WAITING_ANALYSIS);
      
      // Navega para o card de sucesso após um breve delay
      await Utils.sleep(1000);
      flowManager.ui.transitionBetweenCards('obrigado', 1);
      
    } catch (error) {
      console.error('❌ Erro no processo final:', error);
      // Em caso de erro, vai para reprovado
      retryManager.register(this.executeFinalSubmission.bind(this));
      Utils.setErrorMessageToFinalErrorCard('Erro ao tentar processar sua solicitação.');
      flowManager.ui.transitionBetweenCards('erro-final', 1);
    }
  },

  // Faz upload dos documentos
  async uploadDocuments() {
    try {
      const { propostaId, documentos } = flowManager.data.getDataForRequest('uploadDocument');
      // Prepara os documentos para upload
      const documents = await documentos();
      
      // Faz upload de cada documento
      const uploadPromises = documents.map(doc => {
        return flowManager.api.retry(
          () => flowManager.api.uploadDocument(propostaId, doc),
          3, // maxRetries
          2000, // delay inicial
          2 // backoff
        );
      });
      
      const results = await Promise.allSettled(uploadPromises);
      
      // Verifica se todos os uploads foram bem-sucedidos
      const failedUploads = results.filter(result => 
        result.status === 'rejected' ||
        (result.status === 'fulfilled' && !result.value?.success)
      );
      
      if (failedUploads.length > 0) {
        console.error('❌ Alguns uploads falharam:', failedUploads);
        return false;
      }
      
      return true;
      
    } catch (error) {
      console.error('❌ Erro ao fazer upload dos documentos:', error);
      return false;
    }
  },

  // Envia a proposta para análise
  async submitProposalToAnalysis() {
    try {

      const proposalData = flowManager.data.getDataForRequest('submitProposalToAnalyse');
      
      // Aqui você faria a chamada para a API que envia a proposta para análise
      // Por enquanto, vamos simular o processo
      const { data: result } = await flowManager.api.retry(
        () => flowManager.api.submitProposal(proposalData.id, proposalData),
        3, // maxRetries
        2000, // delay inicial
        2 // backoff
      );
      if(result.success) {
        return true;
      } else {
        console.error('❌ Erro ao enviar proposta para análise:', result.error);
        return false;
      }      
    } catch (error) {
      console.error('❌ Erro ao enviar proposta para análise:', error);
      return false;
    }
  },

  // ===== FUNÇÕES PARA FORMULÁRIO DE DADOS PESSOAIS =====

  // Configura submissão do card de dados pessoais
  setupDadosPessoaisSubmission: function () {
    const dadosPessoaisCard = document.querySelector('[data-card-id="formulario-dados-pessoais"]');
    if (!dadosPessoaisCard) {
      return;
    }

    const nextBtn = dadosPessoaisCard.querySelector(".next-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleDadosPessoaisSubmission();
      });
    } else {
      console.log('❌ Botão Avançar não encontrado no card de dados pessoais!');
    }

    // Configura validação em tempo real dos campos
    this.setupDadosPessoaisValidation();
    
    // Verifica estado inicial do botão
    this.checkDadosPessoaisCompletion();
  },

  // Configura validação dos campos de dados pessoais
  setupDadosPessoaisValidation: function () {
    const fields = ["nome-completo", "sexo", "nome-mae", "nome-conjuge"];

    fields.forEach((fieldName) => {
      const input = document.getElementById(fieldName);
      if (input) {
        // Validação em tempo real
        input.addEventListener("blur", (e) => {
          this.validateField(fieldName, e.target.value);
        });

        // Limpar erro quando começar a digitar
        input.addEventListener("input", (e) => {
          this.clearFieldError(fieldName);
          this.checkDadosPessoaisCompletion();
        });

        // Para selects, usar evento change
        if (input.tagName === 'SELECT') {
          input.addEventListener("change", (e) => {
            this.clearFieldError(fieldName);
            this.checkDadosPessoaisCompletion();
            
            // Lógica especial para estado civil
            if (fieldName === 'estado-civil') {
              this.toggleConjugeField(e.target.value);
            }
          });
        }
      }
    });
  },

  // Mostra/oculta campo do cônjuge baseado no estado civil
  toggleConjugeField: function (estadoCivil) {
    const conjugeGroup = document.getElementById('conjuge-group');
    const nomeConjugeInput = document.getElementById('nome-conjuge');
    
    if (!conjugeGroup || !nomeConjugeInput) return;
    
    // Mostra campo do cônjuge apenas para casado(a) - valor 1
    if (estadoCivil === '1') {
      conjugeGroup.style.display = 'block';
      nomeConjugeInput.required = true;
    } else {
      conjugeGroup.style.display = 'none';
      nomeConjugeInput.required = false;
      nomeConjugeInput.value = ''; // Limpa o valor
      this.clearFieldError('nome-conjuge');
    }
    
    // Revalida o formulário após a mudança
    this.checkDadosPessoaisCompletion();
  },

  // Verifica se os dados pessoais estão completos
  checkDadosPessoaisCompletion: function () {
    const dadosPessoaisCard = document.querySelector('[data-card-id="formulario-dados-pessoais"]');
    if (!dadosPessoaisCard) return;

    const nextBtn = dadosPessoaisCard.querySelector(".next-btn");
    if (!nextBtn) return;

    const formData = this.collectDadosPessoaisData();
    const validation = FormValidator.validateForm(formData);
    
    this.toggleButton(nextBtn, validation.isValid);
  },

  // Coleta dados do formulário de dados pessoais
  collectDadosPessoaisData: function () {
    const formData = {};
    const fields = ["nome-completo", "sexo", "nome-mae", "nome-conjuge"];

    fields.forEach((fieldName) => {
      const input = document.getElementById(fieldName);
      if (input) {
        formData[fieldName] = input.value.trim();
      }
    });

    return formData;
  },

  // Processa submissão do card de dados pessoais
  handleDadosPessoaisSubmission: function () {
    
    const formData = this.collectDadosPessoaisData();
    
    // Valida os dados antes de prosseguir
    const validation = FormValidator.validateForm(formData);
    if (!validation.isValid) {
      console.log('❌ Dados pessoais inválidos:', validation.errors);
      return;
    }

    const mappedData = {
      nome: formData['nome-completo'],
      sexo: parseInt(formData.sexo) || 0,
      nomeMae: formData['nome-mae'],
      grauInstrucaoId: 4,
      estadoCivil: 0,
      nomeConjuge: formData['nome-conjuge'] || "null"
    };
       
    // Atualiza dados no DataManager usando a função específica
    flowManager.data.updateDadosPessoais(mappedData);
        
    // Navega para o próximo card
    flowManager.ui.transitionBetweenCards('formulario-rg-naturalidade', 1);
  },

  // ===== FUNÇÕES PARA FORMULÁRIO DE RG E NATURALIDADE =====

  // Configura submissão do card de RG e naturalidade
  setupRgNaturalidadeSubmission: function () {
    const rgNaturalidadeCard = document.querySelector('[data-card-id="formulario-rg-naturalidade"]');
    if (!rgNaturalidadeCard) {
      console.log('❌ Card de RG e naturalidade não encontrado!');
      return;
    }

    const nextBtn = rgNaturalidadeCard.querySelector(".next-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleRgNaturalidadeSubmission();
      });
    } else {
      console.log('❌ Botão Avançar não encontrado no card de RG e naturalidade!');
    }

    // Configura formatação e validação dos campos
    this.setupRgNaturalidadeFormatters();
    this.setupRgNaturalidadeValidation();
    
    // Verifica estado inicial do botão
    this.checkRgNaturalidadeCompletion();
  },

  // Configura formatação dos campos de RG e naturalidade
  setupRgNaturalidadeFormatters: function () {
    // Formatação do campo de data de emissão do RG
    const rgEmissaoInput = document.getElementById("rg-emissao");
    if (rgEmissaoInput) {
      rgEmissaoInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");

        if (value.length <= 2) {
          e.target.value = value;
        } else if (value.length <= 4) {
          e.target.value = value.slice(0, 2) + "/" + value.slice(2);
        } else {
          e.target.value = value.slice(0, 2) + "/" + value.slice(2, 4) + "/" + value.slice(4, 8);
        }
      });
    }

    // Configura requisição de cidades quando selecionar estado
    this.setupNaturalidadeUfChange();
  },

  // Configura evento de mudança no select de estado da naturalidade
  setupNaturalidadeUfChange: function () {
    const naturalidadeUfSelect = document.getElementById("naturalidade-uf");
    if (!naturalidadeUfSelect) return;

    naturalidadeUfSelect.addEventListener("change", async (e) => {
      const estadoId = e.target.value;
      if (!estadoId) {
        this.clearNaturalidadeCidadeSelect();
        return;
      }

      try {
        // Obtém o UF do estado selecionado
        const uf = StateSelectHelper.getUfById(estadoId);
        if (!uf) {
          console.error('❌ UF não encontrado para o estado ID:', estadoId);
          return;
        }

        
        // Faz a requisição para listar cidades
        const { data: result} = await flowManager.api.retry(
          () => flowManager.api.listCities(uf),
          1, // maxRetries
          1000, // delay inicial
          1.5 // backoff
        );
        
        if (result.success && result.data) {
          this.populateNaturalidadeCidadeSelect(result.data);
        } else {
          console.error('❌ Erro ao buscar cidades:', result.error);
          this.clearNaturalidadeCidadeSelect();
        }
      } catch (error) {
        console.error('❌ Erro ao buscar cidades:', error);
        this.clearNaturalidadeCidadeSelect();
      }
    });
  },

  // Popula o select de cidades da naturalidade
  populateNaturalidadeCidadeSelect: function (cidades) {
    const cidadeSelect = document.getElementById("naturalidade-cidade");
    if (!cidadeSelect) return;

    // Limpa opções existentes
    cidadeSelect.innerHTML = '<option value="">Selecione a cidade</option>';

    // Adiciona as novas opções
    cidades.forEach(cidade => {
      const option = document.createElement('option');
      option.value = cidade.cidadeId;
      option.textContent = cidade.cidadeNome;
      cidadeSelect.appendChild(option);
    });

    // Habilita o select
    cidadeSelect.disabled = false;

    // Remove o select customizado anterior se existir
    const existingCustomSelect = cidadeSelect.parentElement.querySelector('.custom-search-select');
    if (existingCustomSelect) {
      existingCustomSelect.remove();
    }

    // Recria o select customizado com as novas opções
    // if (cidadeSelect.hasAttribute('data-search-select')) {
    //   this.recreateCustomSelect(cidadeSelect);
    // }
  },

  // Recria o select customizado para um elemento específico
  recreateCustomSelect: function (selectElement) {
    // Esconde o select original
    selectElement.style.display = 'none';

    // Cria o container customizado
    const container = document.createElement('div');
    container.className = 'custom-search-select';

    // Cria o input de busca
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'custom-search-input';
    input.placeholder = selectElement.options[0]?.text || 'Selecione';

    // Cria a lista de opções
    const dropdown = document.createElement('div');
    dropdown.className = 'custom-search-dropdown';

    // Preenche as opções
    const options = Array.from(selectElement.options).slice(1); // ignora o primeiro (placeholder)
    this.renderCustomSelectOptions(options, dropdown, input, selectElement);

    // Eventos de busca
    input.addEventListener('input', () => {
      const search = input.value.toLowerCase();
      this.renderCustomSelectOptions(options, dropdown, input, selectElement, search);
    });

    // Fecha dropdown ao clicar fora
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) dropdown.style.display = 'none';
    });

    // Monta o componente
    container.appendChild(input);
    container.appendChild(dropdown);
    selectElement.parentNode.insertBefore(container, selectElement.nextSibling);

    // Sincroniza valor inicial
    if (selectElement.value) {
      const selected = options.find(opt => opt.value === selectElement.value);
      if (selected) input.value = selected.text;
    }

    // Abre dropdown ao focar
    input.addEventListener('focus', () => {
      input.select(); // seleciona todo o texto ao focar
      dropdown.style.display = 'block';
      container.classList.add('open');
      this.renderCustomSelectOptions(options, dropdown, input, selectElement, '');
    });
    
  },

  // Renderiza as opções do select customizado
  renderCustomSelectOptions: function (options, dropdown, input, select, search = '') {
    dropdown.innerHTML = '';
    const filtered = options.filter(opt => opt.text.toLowerCase().includes(search));
    if (filtered.length === 0) {
      const noOpt = document.createElement('div');
      noOpt.className = 'custom-search-option disabled';
      noOpt.textContent = 'Nenhuma opção encontrada';
      dropdown.appendChild(noOpt);
      return;
    }
    filtered.forEach(opt => {
      const div = document.createElement('div');
      div.className = 'custom-search-option';
      div.textContent = opt.text;
      div.addEventListener('mousedown', () => {
        input.value = opt.text;
        select.value = opt.value;
        dropdown.style.display = 'none';
        // Dispara evento de mudança no select original
        select.dispatchEvent(new Event('change'));
      });
      dropdown.appendChild(div);
    });
  },

  // Limpa o select de cidades da naturalidade
  clearNaturalidadeCidadeSelect: function () {
    const cidadeSelect = document.getElementById("naturalidade-cidade");
    if (!cidadeSelect) return;

    cidadeSelect.innerHTML = '<option value="">Selecione primeiro o estado</option>';
    cidadeSelect.disabled = true;

    // Remove o select customizado se existir
    const existingCustomSelect = cidadeSelect.parentElement.querySelector('.custom-search-select');
    if (existingCustomSelect) {
      existingCustomSelect.remove();
    }
  },

  // Configura validação dos campos de RG e naturalidade
  setupRgNaturalidadeValidation: function () {
    const fields = ["rg", "rg-emissor", "rg-uf", "rg-emissao", "naturalidade-uf", "naturalidade-cidade"];

    fields.forEach((fieldName) => {
      const input = document.getElementById(fieldName);
      if (input) {
        // Validação em tempo real
        input.addEventListener("blur", (e) => {
          this.validateField(fieldName, e.target.value);
        });

        // Limpar erro quando começar a digitar/selecionar
        input.addEventListener("input", (e) => {
          this.clearFieldError(fieldName);
          this.checkRgNaturalidadeCompletion();
        });

        // Para selects, usar evento change
        if (input.tagName === 'SELECT') {
          input.addEventListener("change", (e) => {
            this.clearFieldError(fieldName);
            this.checkRgNaturalidadeCompletion();
          });
        }
      }
    });
  },

  // Verifica se os dados de RG e naturalidade estão completos
  checkRgNaturalidadeCompletion: function () {
    const rgNaturalidadeCard = document.querySelector('[data-card-id="formulario-rg-naturalidade"]');
    if (!rgNaturalidadeCard) return;

    const nextBtn = rgNaturalidadeCard.querySelector(".next-btn");
    if (!nextBtn) return;

    const formData = this.collectRgNaturalidadeData();
    const validation = FormValidator.validateForm(formData);
    
    this.toggleButton(nextBtn, validation.isValid);
  },

  // Coleta dados do formulário de RG e naturalidade
  collectRgNaturalidadeData: function () {
    const formData = {};
    const fields = ["rg", "rg-emissor", "rg-uf", "rg-emissao", "naturalidade-uf", "naturalidade-cidade"];

    fields.forEach((fieldName) => {
      const input = document.getElementById(fieldName);
      if (input) {
        formData[fieldName] = input.value.trim();
      }
    });

    return formData;
  },

  // Processa submissão do card de RG e naturalidade
  handleRgNaturalidadeSubmission: function () {
    
    const formData = this.collectRgNaturalidadeData();
    
    // Valida os dados antes de prosseguir
    const validation = FormValidator.validateForm(formData);
    if (!validation.isValid) {
      const keys = Object.keys(validation.errors);
      keys.forEach(key => {
        this.showFieldError(key, validation.errors[key]);
      });
      return;
    }

    const mappedData = {
      rg: formData.rg,
      rgEmissor: formData['rg-emissor'],
      rgUfId: parseInt(formData['rg-uf']) || 0,
      rgEmissao: formData['rg-emissao'],
      naturalidadeUfId: parseInt(formData['naturalidade-uf']) || 0,
      naturalidadeCidadeId: parseInt(formData['naturalidade-cidade']) || 0
    };

    // Atualiza dados no DataManager usando a função específica
    flowManager.data.updateRGData(mappedData);

    // Navega para o próximo card
    flowManager.ui.transitionBetweenCards('formulario-endereco', 1);
  },

  // ===== FUNÇÕES PARA FORMULÁRIO DE ENDEREÇO =====

  // Configura submissão do card de endereço
  setupEnderecoSubmission: function () {
    const enderecoCard = document.querySelector('[data-card-id="formulario-endereco"]');
    if (!enderecoCard) {
      console.log('❌ Card de endereço não encontrado!');
      return;
    }

    const nextBtn = enderecoCard.querySelector(".next-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleEnderecoSubmission();
      });
    } else {
      console.log('❌ Botão Avançar não encontrado no card de endereço!');
    }

    // Configura formatação e validação dos campos
    this.setupEnderecoFormatters();
    this.setupEnderecoValidation();
    
    // Verifica estado inicial do botão
    this.checkEnderecoCompletion();
  },

  // Configura formatação dos campos de endereço
  setupEnderecoFormatters: function () {
    // Formatação do campo CEP
    const cepInput = document.getElementById("cep-endereco");
    if (cepInput) {
      cepInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");

        if (value.length <= 5) {
          e.target.value = value;
        } else {
          e.target.value = value.slice(0, 5) + "-" + value.slice(5, 8);
        }
      });
    }

    // Configura busca automática de CEP
    this.setupEnderecoCEPSearch();
  },

  // Configura busca automática de CEP para o formulário de endereço
  setupEnderecoCEPSearch: function () {
    const cepInput = document.getElementById("cep-endereco");
    if (!cepInput) return;

    let timeoutId = null;

    cepInput.addEventListener("input", (e) => {
      const cep = e.target.value.replace(/\D/g, "");

      // Limpa timeout anterior
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Se o CEP tem 8 dígitos, busca automaticamente
      if (cep.length === 8) {
        timeoutId = setTimeout(async () => {
          await this.searchEnderecoByCEP(cep);
        }, 500); // Aguarda 500ms após parar de digitar
      } else {
        // Se o CEP não tem 8 dígitos, limpa os dados do endereço
        this.clearEnderecoData();
      }
    });

    // Limpa dados quando o campo é limpo
    cepInput.addEventListener("change", (e) => {
      const cep = e.target.value.replace(/\D/g, "");
      if (cep.length === 0) {
        this.clearEnderecoData();
      }
    });
  },

  // Busca endereço por CEP para o formulário de endereço
  async searchEnderecoByCEP(cep) {
    const cepInput = document.getElementById("cep-endereco");
    if (!cepInput) return;

    // Mostra indicador de carregamento
    cepInput.classList.add("cep-loading");

    try {
      const resultado = await CepService.preencherEndereco(cep);

      if (resultado) {
        // Remove indicador de carregamento
        cepInput.classList.remove("cep-loading");

        // Mostra sucesso visual
        cepInput.classList.add("cep-success");

        // Remove sucesso visual após 2 segundos
        setTimeout(() => {
          cepInput.classList.remove("cep-success");
        }, 2000);

        // Preenche os campos do endereço
        this.fillEnderecoFields(resultado);

        // Verifica se o formulário está completo após encontrar o CEP
        this.checkEnderecoCompletion();
      } else {
        // Se não encontrou o endereço, limpa os dados
        this.clearEnderecoData();
        this.showFieldError("cep-endereco", "CEP não encontrado ou inválido");
      }
    } catch (error) {
      // Remove indicador de carregamento
      cepInput.classList.remove("cep-loading");
      console.error("Erro ao buscar CEP:", error);

      // Limpa dados do endereço em caso de erro
      this.clearEnderecoData();

      // Verifica estado do formulário mesmo em caso de erro
      this.checkEnderecoCompletion();
    }
  },

  // Preenche os campos do endereço com os dados encontrados
  fillEnderecoFields: function (addressData) {
    const logradouroInput = document.getElementById("logradouro-endereco");
    const bairroInput = document.getElementById("bairro-endereco");
    const cidadeInput = document.getElementById("cidade-endereco");
    const estadoInput = document.getElementById("estado-endereco");

    if (logradouroInput) logradouroInput.value = addressData.logradouro || "";
    if (bairroInput) bairroInput.value = addressData.bairro || "";
    if (cidadeInput) cidadeInput.value = addressData.cidade || "";
    if (estadoInput) estadoInput.value = addressData.estado || "";

    // Dispara eventos para atualizar validação
    [logradouroInput, bairroInput, cidadeInput, estadoInput].forEach(input => {
      if (input) {
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  },

  // Limpa os dados do endereço
  clearEnderecoData: function () {
    const fields = ["logradouro-endereco", "bairro-endereco", "cidade-endereco", "estado-endereco"];
    fields.forEach(fieldId => {
      const input = document.getElementById(fieldId);
      if (input) {
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  },

  // Configura validação dos campos de endereço
  setupEnderecoValidation: function () {
    const fields = ["cep-endereco", "logradouro-endereco", "numero-endereco", "bairro-endereco", "cidade-endereco", "estado-endereco"];

    fields.forEach((fieldName) => {
      const input = document.getElementById(fieldName);
      if (input) {
        // Validação em tempo real
        input.addEventListener("blur", (e) => {
          this.validateField(fieldName, e.target.value);
        });

        // Limpar erro quando começar a digitar
        input.addEventListener("input", (e) => {
          this.clearFieldError(fieldName);
          this.checkEnderecoCompletion();
        });
      }
    });
  },

  // Verifica se os dados de endereço estão completos
  checkEnderecoCompletion: function () {
    const enderecoCard = document.querySelector('[data-card-id="formulario-endereco"]');
    if (!enderecoCard) return;

    const nextBtn = enderecoCard.querySelector(".next-btn");
    if (!nextBtn) return;

    const formData = this.collectEnderecoData();
    const validation = FormValidator.validateForm(formData);
    
    this.toggleButton(nextBtn, validation.isValid);
  },

  // Coleta dados do formulário de endereço
  collectEnderecoData: function () {
    const formData = {};
    const fields = ["cep-endereco", "logradouro-endereco", "numero-endereco", "bairro-endereco", "complemento-endereco"];

    fields.forEach((fieldName) => {
      const input = document.getElementById(fieldName);
      if (input) {
        formData[fieldName] = input.value.trim();
      }
    });

    return formData;
  },

  // Processa submissão do card de endereço
  handleEnderecoSubmission: function () {
    
    const formData = this.collectEnderecoData();
    
    // Valida os dados antes de prosseguir
    const validation = FormValidator.validateForm(formData);
    if (!validation.isValid) {
      return;
    }

    const mappedData = {
      cep: (formData['cep-endereco'] ?? "").replace(/\D/g, ""),
      logradouro: formData['logradouro-endereco'],
      numero: formData['numero-endereco'],
      bairro: formData['bairro-endereco'],      
      complemento: formData['complemento-endereco'] || "null",      
    };
    
    // Atualiza dados no DataManager usando a função específica
    flowManager.data.updateAddressFromForm(mappedData);

    // Navega para o próximo card
    flowManager.ui.transitionBetweenCards('formulario-bancario', 1);
  },

  // ===== FUNÇÕES PARA FORMULÁRIO BANCÁRIO =====

  // Configura submissão do card de dados bancários
  setupBancarioSubmission: function () {
    const bancarioCard = document.querySelector('[data-card-id="formulario-bancario"]');
    if (!bancarioCard) {
      return;
    }

    const nextBtn = bancarioCard.querySelector(".next-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleBancarioSubmission();
      });
    } else {
      console.log('❌ Botão Avançar não encontrado no card de dados bancários!');
    }

    // Configura validação em tempo real dos campos
    this.setupBancarioValidation();
    
    // Verifica estado inicial do botão
    this.checkBancarioCompletion();
  },

  // Configura validação dos campos bancários
  setupBancarioValidation: function () {
    const fields = ["banco-id", "agencia-bancario", "digito-bancario", "numero-bancario", "tipo-conta-bancario"];

    fields.forEach((fieldName) => {
      const input = document.getElementById(fieldName);
      if (input) {
        // Validação em tempo real
        input.addEventListener("blur", (e) => {
          this.validateField(fieldName, e.target.value);
        });

        // Limpar erro quando começar a digitar/selecionar
        input.addEventListener("input", (e) => {
          this.clearFieldError(fieldName);
          this.checkBancarioCompletion();
        });

        // Para selects, usar evento change
        if (input.tagName === 'SELECT') {
          input.addEventListener("change", (e) => {
            this.clearFieldError(fieldName);
            this.checkBancarioCompletion();
          });
        }
      }
    });
  },

  // Verifica se os dados bancários estão completos
  checkBancarioCompletion: function () {
    const bancarioCard = document.querySelector('[data-card-id="formulario-bancario"]');
    if (!bancarioCard) return;

    const nextBtn = bancarioCard.querySelector(".next-btn");
    if (!nextBtn) return;

    const formData = this.collectBancarioData();
    const validation = FormValidator.validateForm(formData);
    
    this.toggleButton(nextBtn, validation.isValid);
  },

  // Coleta dados do formulário bancário
  collectBancarioData: function () {
    const formData = {};
    const fields = ["banco-id", "agencia-bancario", "digito-bancario", "numero-bancario", "tipo-conta-bancario"];

    fields.forEach((fieldName) => {
      const input = document.getElementById(fieldName);
      if (input) {
        formData[fieldName] = input.value.trim();
      }
    });

    return formData;
  },

  // Processa submissão do card de dados bancários
  handleBancarioSubmission: function () {
    
    const formData = this.collectBancarioData();
    
    // Valida os dados antes de prosseguir
    const validation = FormValidator.validateForm(formData);
    if (!validation.isValid) {
      console.log('❌ Dados bancários inválidos:', validation.errors);
      return;
    }

    const mappedData = {
      bancoId: formData['banco-id'],
      agencia: formData['agencia-bancario'],
      digito: formData['digito-bancario'],
      numeroConta: formData['numero-bancario'],
      conta: 1,
      tipoConta: parseInt(formData['tipo-conta-bancario']) || 0,
      tempoConta: 1
    };

    // Atualiza dados no DataManager usando a função específica
    flowManager.data.updateBankData(mappedData);
    
    // Navega para o próximo card (upload de imagens)
    flowManager.ui.transitionBetweenCards('upload-imagens', 1);
  },
};

class FlowValidator {
  constructor() {
    this.navigationStates = {
      APPROVED: 'approved',
      REJECTED: 'rejected',
      NO_ENERGY_PRODUCT: 'no_energy_product',
      SUCCESS: 'success',
      EM_ANALISE: 'em_analise'
    }
  }

  // Valida resultado da simulação
  validateSimulation(simulationResult) {
    if (!simulationResult.success) {
      const hasOpenProposal = flowManager.api.checkError(simulationResult, 'proposta em andamento'); // Proposta já existe
      if (hasOpenProposal) {
        return {
          isValid: false,
          navigationState: this.navigationStates.REJECTED,
          message: 'Proposta já existe'
        }
      }

      return {
        isValid: false,
        navigationState: this.navigationStates.REJECTED,
        message: 'Falha na simulação: ' + simulationResult.error
      };
    }

    if (!simulationResult.data.aprovado) {
      return {
        isValid: false,
        navigationState: this.navigationStates.REJECTED,
        message: 'Proposta não aprovada'
      };
    }

    return {
      isValid: true,
      navigationState: this.navigationStates.APPROVED,
      message: 'Simulação aprovada'
    };
  }

  // Valida resultado das ofertas
  validateOffers(offersResult) {
    if (!offersResult.success) {
      return {
        isValid: false,
        navigationState: this.navigationStates.REJECTED,
        message: 'Falha ao buscar ofertas: ' + offersResult.error
      };
    }

    // Verifica se tem produto energia
    const hasEnergyProduct = offersResult.data.produtos.some(
      produto => produto.nome === 'Energia'
    );

    if (!hasEnergyProduct) {
      return {
        isValid: false,
        navigationState: this.navigationStates.NO_ENERGY_PRODUCT,
        message: 'Produto energia não disponível'
      };
    }

    return {
      isValid: true,
      navigationState: this.navigationStates.SUCCESS,
      message: 'Ofertas válidas'
    };
  }
}

class UIManager {
  constructor() {
    this.isAnimating = false;
    this.pendingAnimations = []; // Fila de animações pendentes
    this.animations = {
      cardOut: (cardElement, direction, onCompleteCallback) => {
        const tl = gsap.timeline({ onComplete: onCompleteCallback });
        const scaleAnim = {
          scale: 1.1,
          duration: 0.25,
          ease: "power1.inOut",
          willChange: "transform, opacity",
        };
        const xAnim = {
          x: direction === 1 ? -120 : 120,
          opacity: 0,
          duration: 0.35,
          ease: "power1.in",
          willChange: "transform, opacity",
          onComplete: () => {
            cardElement.classList.remove("card-active");
            cardElement.classList.add("card-passed");
            setTimeout(() => {
              gsap.set(cardElement, {
                x: 0,
                scale: 1,
                opacity: 0,
                rotate: 0,
                zIndex: -1,
                pointerEvents: "none",
              });
            }, 150);
          },
        };
        tl.to(cardElement, scaleAnim).to(cardElement, xAnim);
        return tl;
      },
      cardIn: (cardElement) => {
        const tl = gsap.timeline();
        gsap.set(cardElement, {
          rotate: -9,
          opacity: 0.1,
          scale: 0.97,
          zIndex: -1,
        });
        tl.to(cardElement, {
          rotate: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power1.out",
          willChange: "transform, opacity",
          onStart: () => {
            cardElement.classList.add("card-active");
            cardElement.classList.remove("card-behind", "card-passed");
            cardElement.style.zIndex = 2;
            cardElement.style.pointerEvents = "auto";
            cardElement.style.visibility = "visible";
            Array.from(cardElement.children).forEach(
              (child) => (child.style.visibility = "visible")
            );
            this.animations.cardProgress(cardElement);
          },
        });
        return tl;
      },
      cardProgress: (cardElement) => {
        if (cardElement.dataset.progress) {
          document.documentElement.style.setProperty(
            "--progress-width",
            `${cardElement.dataset.progress}%`
          );
        }
      },
    };
    this.cards = Array.from(document.querySelectorAll(".card"));
  }

  // Agenda uma transição de card para ser executada quando possível
  scheduleCardTransition(targetCardId, direction = 1) {
    const animation = { targetCardId, direction };
    this.pendingAnimations.push(animation);
    
    // Se não há animação em andamento, executa imediatamente
    if (!this.isAnimating) {
      this.processNextAnimation();
    }
  }

  // Processa a próxima animação na fila
  processNextAnimation() {
    if (this.pendingAnimations.length === 0) {
      this.isAnimating = false;
      return;
    }

    const animation = this.pendingAnimations.shift();
    this.isAnimating = true;
    
    this.executeCardTransition(animation.targetCardId, animation.direction);
  }

  // Executa a transição de card
  executeCardTransition(targetCardId, direction = 1) {
    const currentCard = document.querySelector(".card-active");
    const targetCard = document.querySelector(
      `[data-card-id='${targetCardId}']`
    );

    if (!targetCard || currentCard === targetCard) {
      this.isAnimating = false;
      this.processNextAnimation(); // Processa próxima animação na fila
      return;
    }

    // Lógica específica que futuramente será um hook 'onEnter'
    if (targetCardId === "resumo") {
      this.populateSummaryCard();
    }

    const onOutComplete = () => {
      this.animations.cardIn(targetCard).eventCallback("onComplete", () => {
        this.isAnimating = false;
        this.processNextAnimation(); // Processa próxima animação na fila
      });
    };

    this.animations.cardOut(currentCard, direction, onOutComplete);
  }

  // Método público para transição de cards (mantém compatibilidade)
  transitionBetweenCards(targetCardId, direction = 1) {
    this.scheduleCardTransition(targetCardId, direction);
  }

  // Método para mostrar card instantaneamente (sem animação)
  showCardInstant(cardId) {
    const card = document.querySelector(`[data-card-id='${cardId}']`);
    const container = document.querySelector(".card-container");
    if (cardId === "continuar" && card && container.firstChild !== card) {
      container.insertBefore(card, container.firstChild);
    }
    this.cards.forEach((cardEl) => {
      if (cardEl === card) {
        cardEl.classList.add("card-active");
        cardEl.classList.remove("card-behind", "card-passed");
        cardEl.style.pointerEvents = "auto";
        cardEl.style.zIndex = 2;
        Array.from(cardEl.children).forEach(
          (child) => (child.style.visibility = "visible")
        );
      } else {
        cardEl.classList.remove("card-active", "card-passed");
        cardEl.classList.add("card-behind");
        cardEl.style.pointerEvents = "none";
        cardEl.style.zIndex = 0;
        Array.from(cardEl.children).forEach(
          (child) => (child.style.visibility = "hidden")
        );
      }
    });
  }

  // Limpa a fila de animações pendentes
  clearPendingAnimations() {
    this.pendingAnimations = [];
  }

  // Força uma transição imediata (ignora fila)
  forceCardTransition(targetCardId, direction = 1) {
    this.clearPendingAnimations();
    this.isAnimating = false;
    this.executeCardTransition(targetCardId, direction);
  }

  // Obtém o status da fila de animações
  getAnimationQueueStatus() {
    return {
      isAnimating: this.isAnimating,
      pendingCount: this.pendingAnimations.length,
      pendingAnimations: this.pendingAnimations.map(a => a.targetCardId)
    };
  }

  // Método de debug para verificar status das animações
  debugAnimationQueue() {
    const status = this.getAnimationQueueStatus();
    return status;
  }

  animateCardLoading(step = 0, type = 'normal') {
    let cardId;
    switch(type) {
      case 'continuar':
        cardId = 'loading-continuar';
        break;
      case 'salvar':
        cardId = 'loading-salvar';
        break;
      case 'final':
        cardId = 'loading-final';
        break;
      case 'energia':
        cardId = 'loading-energia';
        break;
      default:
        cardId = 'loading';
        break;
    }
    
    const loadingCard = document.querySelector(`[data-card-id="${cardId}"]`);
    const steps = loadingCard.querySelectorAll(".loading-step");
    let currentStep = step;
    steps.forEach((step, index) => {
      const stepIcon = step.querySelector(".step-icon");
      if (index <= currentStep) {
        step.classList.add("active");
        // Mudar ícone para check quando ativo
        if (index === currentStep) {
          stepIcon.textContent = "✓";
          stepIcon.style.background = "var(--success-color)";
        }
      } else {
        step.classList.remove("active");
        stepIcon.textContent = "⏳";
        stepIcon.style.background = "#e5e7eb";
      }
    });
  }

  resetCardLoading(type = 'normal') {
    let cardId;
    switch(type) {
      case 'continuar':
        cardId = 'loading-continuar';
        break;
      case 'salvar':
        cardId = 'loading-salvar';
        break;
      case 'final':
        cardId = 'loading-final';
        break;
      case 'energia':
        cardId = 'loading-energia';
        break;
      default:
        cardId = 'loading';
        break;
    }
    
    const loadingCard = document.querySelector(`[data-card-id="${cardId}"]`);
    if (!loadingCard) return;
    const steps = loadingCard.querySelectorAll(".loading-step");
    steps.forEach((step, index) => {
      const stepIcon = step.querySelector(".step-icon");
      step.classList.remove("active");
      stepIcon.textContent = index === 0 ? "✓" : "⏳";
      stepIcon.style.background =
        index === 0 ? "var(--success-color)" : "#e5e7eb";
    });
  }

  // Popula o card de resumo com os dados selecionados
  populateSummaryCard() {
    const userSelections = flowManager.data.getUserSelections();
    
    if (userSelections.valor && userSelections.prestacao) {
      const valorElement = document.getElementById("resumo-valor");
      const parcelasElement = document.getElementById("resumo-parcelas");
      
      if (valorElement) {
        valorElement.textContent = `R$ ${Utils.formatCurrency(userSelections.valor)}`;
      }
      
      if (parcelasElement) {
        parcelasElement.textContent = `${userSelections.plano}x de R$ ${Utils.formatCurrency(userSelections.prestacao)}`;
      }
    }
  }

  setupDynamicSliders(options) {
    const budgetSlider = document.getElementById("budget-slider");
    const budgetValue = document.getElementById("budget-value");
    const budgetVisual = document.getElementById("budget-slider-visual");
    const budgetLabels =
      budgetSlider.parentElement.querySelector(".slider-labels");

    const durationSlider = document.getElementById("duration-slider");
    const durationValue = document.getElementById("duration-value");
    const durationVisual = document.getElementById("duration-slider-visual");
    const durationLabels =
      durationSlider.parentElement.querySelector(".slider-labels");

    const loanValues = options ? options.map((opt) => opt.valor) : [];

    function animateTextUpdate(element, newText) {
      if (element.timeline) {
        element.timeline.kill();
      }

      element.innerHTML = "";

      const newSpans = newText.split("").map((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        return span;
      });
      newSpans.forEach((span) => element.appendChild(span));

      element.timeline = gsap.timeline({
        onComplete: () => {
          delete element.timeline;
        },
      });

      element.timeline.from(newSpans, {
        y: -10,
        opacity: 0,
        stagger: 0.03,
        duration: 0.25,
        ease: "power2.out",
      });
    }

    function updateSliderVisuals(
      visualEl,
      labelsEl,
      values,
      activeIndex,
      labelFormatter
    ) {
      let visualHTML = "";
      if (values.length > 0) {
        visualHTML += '<span class="dot"></span>';
      }
      for (let i = 0; i < values.length - 1; i++) {
        visualHTML += '<span class="segment"></span><span class="dot"></span>';
      }
      visualEl.innerHTML = visualHTML;

      const dots = visualEl.querySelectorAll(".dot");
      const segments = visualEl.querySelectorAll(".segment");

      dots.forEach((dot, i) =>
        dot.classList.toggle("active", i <= activeIndex)
      );
      segments.forEach((seg, i) =>
        seg.classList.toggle("active", i < activeIndex)
      );

      labelsEl.innerHTML = values
        .map((val) => `<span>${labelFormatter(val)}</span>`)
        .join("");
    }

    function updateDurationSliderUI(loanIndex) {
      const selectedLoan = options[loanIndex];
      const installments = selectedLoan.parcelas;
      const installmentTerms = installments.map((p) => p.prazo);

      durationSlider.min = 0;
      durationSlider.max =
        installments.length > 1 ? installments.length - 1 : 1;
      durationSlider.value = 0;

      const updateDisplay = (animate = false) => {
        const installmentIndex = parseInt(durationSlider.value);
        const selectedInstallment = installments[installmentIndex];

        if (selectedInstallment) {
          const newLabel = `${
            selectedInstallment.prazo
          }x de R$ ${Utils.formatCurrency(selectedInstallment.valor)}`;
          if (animate) {
            animateTextUpdate(durationValue, newLabel);
          } else {
            if (durationValue.timeline) {
              durationValue.timeline.kill();
            }
            durationValue.innerHTML = "";
            durationValue.textContent = newLabel;
          }
        }

        updateSliderVisuals(
          durationVisual,
          durationLabels,
          installmentTerms,
          installmentIndex,
          (val) => val
        );
      };

      durationSlider.oninput = () => {
        updateDisplay(true);
        updateSelectionState();
      };
      updateDisplay(false);
    }

    function updateSelectionState() {
      const loanIndex = parseInt(budgetSlider.value);
      const installmentIndex = parseInt(durationSlider.value);
      const selectedLoan = options[loanIndex];
      if (selectedLoan && selectedLoan.parcelas[installmentIndex]) {
        const loanData = {
          valor: selectedLoan.valor,
          parcela: selectedLoan.parcelas[installmentIndex],
        };

        // Atualiza as seleções do usuário no DataManager
        flowManager.data.updateUserLoanSelection(loanData);
      }
    }

    function setupBudgetSlider() {
      budgetSlider.min = 0;
      budgetSlider.max = loanValues.length > 1 ? loanValues.length - 1 : 1;
      budgetSlider.value = 0;

      const updateOnChange = () => {
        const loanIndex = parseInt(budgetSlider.value);
        animateTextUpdate(
          budgetValue,
          `R$ ${Utils.formatCurrency(loanValues[loanIndex])}`
        );

        updateSliderVisuals(
          budgetVisual,
          budgetLabels,
          loanValues,
          loanIndex,
          Utils.formatCurrencyAbbreviated
        );

        updateDurationSliderUI(loanIndex);
        updateSelectionState();
      };

      budgetSlider.oninput = updateOnChange;
      updateOnChange();
    }

    setupBudgetSlider();
    updateSelectionState();
  }
}

class FlowNavigator {
  constructor() {
    this.cards = {
      LOADING: 'loading',
      OFFERS: 'ofertas',
      REJECTED: 'reprovado',
      SUCCESS: 'sucesso',
      EM_ANALISE: 'em-analise'
    }
  }

  // Navega baseado no estado de validação
  navigateToCard(navigationState) {
    switch (navigationState) {
      case 'approved':
        // Continua para ofertas
        return this.cards.OFFERS;
        
      case 'rejected':
        // Vai para card reprovado
        return this.cards.REJECTED;
        
      case 'no_energy_product':
        // Vai para card reprovado (produto não disponível)
        return this.cards.REJECTED;
        
      case 'success':
        // Continua fluxo normal
        return this.cards.OFFERS;
        
      case 'em_analise':
        // Vai para card em análise
        return this.cards.EM_ANALISE;
        
      default:
        // Estado desconhecido, vai para reprovado
        return this.cards.REJECTED;
    }
  }

  // Função para navegar (será implementada pela UI)
  navigate(targetCard) {
    // Aqui você implementaria a navegação real
    // Por exemplo: animateToCard(targetCard, 1);
  }
}

class FlowManager {
  constructor(apiManager, dataManager, validator, navigator, uiManager) {
    this.api = apiManager;
    this.data = dataManager;
    this.validator = validator;
    this.navigator = navigator;
    this.ui = uiManager;
  }

  async executeOffersAndParcelsFlow() {
    const retryFns = async () => {
      this.ui.resetCardLoading("normal");
      this.ui.animateCardLoading(0, 'normal');
      this.ui.transitionBetweenCards('loading', 1);
      await Utils.sleep(1000);
      this.ui.animateCardLoading(1, 'normal');
      this.executeOffersAndParcelsFlow();
    }

    try {
      // 1. Buscar ofertas
      const offersResult = await this.getOffers();
      await Utils.sleep(1000);

      this.ui.animateCardLoading(2, 'normal');
      this.ui.animateCardLoading(2, 'continuar');
      const offersValidation = this.validator.validateOffers(offersResult);
      
      if (!offersValidation.isValid) {
        console.log('❌ Ofertas inválidas:', offersValidation.message);
        const targetCard = this.navigator.navigateToCard(offersValidation.navigationState);
        this.ui.transitionBetweenCards(targetCard, 1);
        return { 
          success: false, 
          error: offersValidation.message,
          navigationState: offersValidation.navigationState
        };
      }

      // 2. Calcular data de vencimento
      const dueDateResult = await this.calculateDueDate();      
      
      if (!dueDateResult?.success) {
        retryManager.register(retryFns);
        Utils.setErrorMessageToFinalErrorCard('Falha ao tentar calcular data de vencimento');
        flowManager.ui.transitionBetweenCards('erro-final', 1);
        return;
      }

      SimulationStep.save(SimulationStep.OFFER);
      this.ui.transitionBetweenCards("dados-energia", 1);
      
      return { success: true };

    } catch (error) {
      console.error('❌ Erro no fluxo de ofertas e parcelas:', error);
      retryManager.register(retryFns);
      Utils.setErrorMessageToFinalErrorCard('Falha ao tentar buscar ofertas e parcelas');
      flowManager.ui.transitionBetweenCards('erro-final', 1);
      return { success: false, error: "Falha ao tentar buscar ofertas e parcelas" };
    }
  }

  async executeEnergyDataFlow() {
    const retryFns = async () => {
      this.ui.resetCardLoading("energia");
      this.ui.animateCardLoading(0, 'energia');
      this.ui.transitionBetweenCards('loading-energia', 1);
      await Utils.sleep(1000);
      this.ui.animateCardLoading(1, 'energia');
      this.executeEnergyDataFlow();
    }

    try {
      // Mostra loading específico para validação da energia
      this.ui.transitionBetweenCards('loading-energia', 1);
      this.ui.resetCardLoading('energia');
      this.ui.animateCardLoading(0, 'energia');
      
      // 1. Validar dados da energia
      const energyValidationResult = await this.validateEnergyData();
      await Utils.sleep(1000);
      
      this.ui.animateCardLoading(1, 'energia');
      
      if (!energyValidationResult?.success) {
        retryManager.register(retryFns);
        Utils.setErrorMessageToFinalErrorCard('Falha ao validar dados da energia');
        flowManager.ui.transitionBetweenCards('erro-final', 1);
        return;
      }

      // Verifica se os dados da energia estão corretos
      if (!energyValidationResult.data?.unidadeCorreta) {
        console.log('❌ Dados da energia inválidos');
        // Navega para card de dados de energia inválidos
        this.ui.transitionBetweenCards('dados-energia-invalidos', 1);
        return { success: false, error: 'Dados da energia inválidos' };
      }

      // 2. Buscar valor máximo disponível (agora com dados validados)
      const { success, data: maxAvailableOfferResult } = await this.getMaxAvailableOffer();
      if (!success) {
        retryManager.register(retryFns);
        Utils.setErrorMessageToFinalErrorCard('Falha ao tentar buscar valor máximo disponível');
        flowManager.ui.transitionBetweenCards('erro-final', 1);
        return;
      }

      const maxAvailableOffer = maxAvailableOfferResult?.data?.valorLimiteSolicitado ?? 1500;
      this.filterAndUpdateValuesForOffer(maxAvailableOffer);

      this.ui.animateCardLoading(2, 'energia');

      // 3. Buscar parcelas
      const parcelsResult = await this.getParcels();
      if (!parcelsResult?.success) {
        retryManager.register(retryFns);
        Utils.setErrorMessageToFinalErrorCard('Falha ao tentar buscar parcelas');
        flowManager.ui.transitionBetweenCards('erro-final', 1);
        return;
      }

      // 4. Navega para ofertas (slider)
      this.ui.transitionBetweenCards(this.navigator.cards.OFFERS, 1);
      // Limpa o formulário principal
      Utils.limparFormularioPrincipal();
      
      return { success: true };

    } catch (error) {
      console.error('❌ Erro no fluxo de validação da energia:', error);
      retryManager.register(retryFns);
      Utils.setErrorMessageToFinalErrorCard('Falha ao tentar validar dados da energia');
      flowManager.ui.transitionBetweenCards('erro-final', 1);
      return { success: false, error: "Falha ao tentar validar dados da energia" };
    }
  }

  async validateEnergyData() {
    const data = this.data.getDataForRequest('validateEnergyData');
    const { data: result, error } = await this.api.retry(
      () => this.api.validateEnergyData(data),
      3, // maxRetries
      1000, // delay inicial
      2 // backoff
    );

    return result ?? error;    
  }

  async executeSimulationFlow() {
    try {
      // 1. Criar simulação
      this.ui.transitionBetweenCards("loading", 1);
      const simulationResult = await this.createSimulation();

      // Salva dados da simulação no Google Sheets
      await this.saveDataToSheet(simulationResult?.data?.aprovado);

      this.ui.animateCardLoading(1, 'normal');
      const simulationValidation = this.validator.validateSimulation(simulationResult);
      
      if (!simulationValidation.isValid) {
        if(simulationValidation.message.includes('Proposta já existe')) {
          const data = this.data.getDataForRequest('searchByCpf');
          const existingProposal = await this.checkExistingProposalByCpf(data);
          if (existingProposal.exists) {
            this.data.updateApiData({ propostaId: existingProposal.propostaId });
            ProposalStorageManager.saveProposalId(existingProposal.propostaId);
            return await this.continueFromSavedProposal();
          }
        }
        // se não existe proposta, continua para o fluxo normal
        console.log('❌ Simulação inválida:', simulationValidation.message);
        const targetCard = this.navigator.navigateToCard(simulationValidation.navigationState);
        this.ui.transitionBetweenCards(targetCard, 1);
        return { 
          success: false, 
          error: simulationValidation.message,
          navigationState: simulationValidation.navigationState
        };
      }

      // Salva o ID da proposta no localStorage quando aprovado
      const propostaId = this.data.getDataForRequest('getSimulation').propostaId;
      ProposalStorageManager.saveProposalId(propostaId);
      // 2. Executa fluxo de ofertas e parcelas
      return await this.executeOffersAndParcelsFlow();

    } catch (error) {
      console.error('❌ Erro no fluxo de simulação:', error);
      Utils.limparFormularioPrincipal();
      // Em caso de erro, vai para reprovado
      this.navigator.navigate(this.navigator.cards.REJECTED);
      
      return { success: false, error: error.message };
    }
  }

  async createSimulation() {
    const data = this.data.getDataForRequest('simulation');    
    const { success, data: result, error } = await this.api.retry(
      () => this.api.createSimulation(data),
      1, // maxRetries
      1000, // delay inicial
      2 // backoff
    );

    if (success && result?.data?.propostaId) {
      // Atualiza estado com dados da simulação
      this.data.updateApiData({
        propostaId: result.data.propostaId,
      });
    }
    
    return result ?? error;
  }

  async getOffers() {
    const data = this.data.getDataForRequest('getOffer');
    const { success, data: result, error } = await this.api.retry(
      () => this.api.getOffer(data.offerId),
      3, // maxRetries
      500, // delay inicial
      1.5 // backoff
    );
    
    if (success) {
      // Extrai e atualiza dados das ofertas
      const extractedData = this.extractOfferData(result.data);
      this.data.updateApiData(extractedData);
    }
    
    return result ?? error;
  }

  async calculateDueDate() {
    const data = this.data.getDataForRequest('getDueDate');
    const { success, data: result, error } = await this.api.retry(
      () => this.api.getDueDate(data),
      3, // maxRetries
      1000, // delay inicial
      2 // backoff
    );
    
    if (success) {
      this.data.updateApiData({
        vencimento: result.data[0].vencimento
      });
    }
    
    return result ?? error;
  }

  async getMaxAvailableOffer() {
    const { propostaId , ...data } = this.data.getDataForRequest('maxAvailableOffer');
    const { success, data: result, error } = await this.api.retry(
      () => this.api.maxAvailableOffer(propostaId, data),
      3, // maxRetries
      1000, // delay inicial
      2 // backoff
    );
    
    return { success, data: result, error };
  }

  async getParcels() {
    // Obtém os valores da tabela de juros
    const valores = this.data.getValuesForOffer();
    
    if (!valores || valores.length === 0) {
      console.log('❌ Nenhum valor encontrado para calcular parcelas');
      return { success: false, error: 'Nenhum valor encontrado' };
    }

    const orderValues = valores.sort((a, b) => a.valor - b.valor);

    const parcelasCalculadas = [];
    // Calcula parcelas para cada valor
    for (const valorItem of orderValues) {
      const data = this.data.getDataForRequest('getParcel');
      const { success, data: result, error } = await this.api.retry(
        () => this.api.getParcel({ ...data, valor: valorItem.valor }),
        3, // maxRetries
        1000, // delay inicial
        2 // backoff
      ); 
      
      if (success) {
        // Processa as parcelas para este valor
        const parcelasProcessadas = this.processParcelDataForValue(valorItem.valor, result.data);
        parcelasCalculadas.push(parcelasProcessadas);
        console.log(`✅ Parcelas calculadas para R$ ${valorItem.valor}:`, parcelasProcessadas.parcelas.length, 'opções');
      } else {
        console.error(`❌ Erro ao calcular parcelas para R$ ${valorItem.valor}:`, result.error);
        return result ?? error;
      }
    }

    // Atualiza o estado com todas as parcelas calculadas
    this.data.updateApiData({
      parcelasCalculadas: parcelasCalculadas
    });

    this.ui.setupDynamicSliders(parcelasCalculadas);

    return { success: true };
  }

  async saveDataToSheet(isApproved = false) {
    const jsonData = this.data.getDataForRequest('saveDataToSheet');
    const formData = new FormData();
    Object.entries(jsonData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('aprovado', isApproved ? 'SIM' : 'NÃO');

    await this.api.retry(
      () => this.api.saveDataToSheet(formData),
      1, // maxRetries
      1000, // delay inicial
      2 // backoff
    );

    return { success: true };
  }

  // Continua fluxo a partir da proposta salva
  async continueFromSavedProposal() {
    try {
      const propostaId = ProposalStorageManager.getProposalId();
      if (!propostaId) {
        return { success: false, error: 'Nenhuma proposta válida encontrada' };
      }
      
      // 1. Buscar dados da simulação salva
      this.ui.transitionBetweenCards("loading-continuar", 1);
      const { success, data: simulationData } = await this.api.retry(
        () => this.api.getSimulation(propostaId),
        2, // maxRetries
        3000, // delay inicial
        2 // backoff
      );
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.ui.animateCardLoading(1, 'continuar');
      
      if (!success) {
        return { success: false, error: 'Nenhuma proposta válida encontrada' };
      }

      // Extrai e atualiza os dados da simulação no DataManager
      this.extractAndUpdateFromSimulation(simulationData);

      // 2. Verifica o status da simulação
      const status = simulationData.data.proposta.situacaoDescricao;
      
      switch (status) {
        case 'Seleção Oferta':
          return await this.executeOffersAndParcelsFlow();
        case 'Aguard. Cadastro':
          return await this.continueFromAguardCadastro();
        case 'Cancelada':
          return { success: false, error: 'Proposta cancelada' };
        default:
          return await this.continueFromEmAnalise();
      }
      
    } catch (error) {
      console.error('❌ Erro no fluxo de continuação:', error);
      ProposalStorageManager.clearProposalId();
      this.navigator.navigate(this.navigator.cards.REJECTED);
      return { success: false, error: "Nenhuma proposta válida encontrada" };
    }
  }

  // Verifica se existe uma proposta aberta para o CPF
  async checkExistingProposalByCpf(data) {
    try {
      const {data: result } = await this.api.retry(
        () => this.api.searchByCpf(data),
        2, // maxRetries
        3000, // delay inicial
        2 // backoff
      );
      if (result?.id && result?.status) {
        return {
          exists: true,
          propostaId: result.id,
          status: result.status
        };
      }
      return { exists: false };
    } catch (error) {
      console.error('Erro ao verificar proposta existente:', error);
      return { exists: false };
    }
  }

  processParcelDataForValue(valor, parcelData) {
    // Estrutura para armazenar os dados do valor e suas parcelas
    const valorComParcelas = {
      valor: valor,
      parcelas: []
    };

    // Processa as parcelas recebidas da API
    if (parcelData.prazoValor && Array.isArray(parcelData.prazoValor)) {
      const maxParcelas = 5;
      parcelData.prazoValor.slice(0, maxParcelas).forEach(parcela => {
        valorComParcelas.parcelas.push({
          prazo: parcela.prazo,
          valor: parcela.valor
        });
      });
    }

    // Ordena as parcelas por prazo (crescente)
    valorComParcelas.parcelas.sort((a, b) => a.prazo - b.prazo);

    return valorComParcelas;
  }

  extractOfferData(offerData) {
    // Extrai dados relevantes das ofertas
    const energyProduct = offerData.produtos.find(p => p.nome === 'Energia');
    if (energyProduct && energyProduct.convenio[0]) {
      const convenio = energyProduct.convenio[0];
      const cia = convenio.nome;
      this.data.updateCia({ nome: cia });
      
      // Extrai dados adicionais (campos que o usuário vai preencher)
      const adicionaisApi = convenio.convenioDados || [];
      
      // Extrai valores da tabela de juros (para o slider)
      const tabelaJurosValores = this.extractTabelaJurosValores(convenio.tabelaJuros[0]);
      
      // Gera campos dinâmicos se houver dados adicionais
      if (adicionaisApi && adicionaisApi.length > 0) {
        this.generateDynamicEnergyFields(adicionaisApi);
      } else {
        console.log('⚠️ Nenhum dado adicional encontrado para gerar campos dinâmicos');
      }
      
      return {
        convenioId: convenio.id,
        tabelaJurosId: convenio.tabelaJuros[0].id,
        ofertas: energyProduct,
        adicionaisApi: adicionaisApi,
        tabelaJurosValores: tabelaJurosValores,
        renda: offerData.proposta.valorRendaPresumida
      };
    }
    return {};
  }

  filterAndUpdateValuesForOffer(maxAvailableOffer) {
    const allValues = this.data.getValuesForOffer();
    const filteredValues = allValues.filter(value => value.valor <= maxAvailableOffer);
    const fiveValues = this.formatLoanEqualDivided(filteredValues);
    this.data.updateApiData({
      tabelaJurosValores: fiveValues
    });
  }

  // Gera campos dinamicamente no card de dados de energia
  generateDynamicEnergyFields(adicionaisData) {
    if (!adicionaisData || !Array.isArray(adicionaisData) || adicionaisData.length === 0) {
      console.log('❌ Nenhum dado adicional para gerar campos');
      return false;
    }

    // Ordena os campos pela ordem definida na API
    const camposOrdenados = [...adicionaisData].sort((a, b) => a.ordem - b.ordem);
    
    const cardDadosEnergia = document.querySelector('[data-card-id="dados-energia"]');
    if (!cardDadosEnergia) {
      console.error('❌ Card de dados de energia não encontrado');
      return false;
    }

    const formContainer = cardDadosEnergia.querySelector('.form-container');
    if (!formContainer) {
      console.error('❌ Container do formulário não encontrado');
      return false;
    }

    // Limpa o container
    formContainer.innerHTML = '';

    // Gera os campos dinamicamente
    camposOrdenados.forEach((campo, index) => {
      const fieldGroup = this.createDynamicFieldGroup(campo);      
      formContainer.appendChild(fieldGroup);
      this.setupDynamicFieldValidation(campo);
      const cia = this.data.getCiaName();
      const tipDescription = CiaTips.getTips(cia, campo.nome || "");
      if(tipDescription) {
        // Adiciona uma dica fixa abaixo do campo
        const dica = document.createElement('small');
        dica.className = 'dica-campo dica-destaque';
        dica.innerText = `💡 Dica: ${tipDescription}`;
        formContainer.appendChild(dica);
      }
      if(index === 0) {
        const imgUrl = CiaTips.getCiaImgUrl(cia);
        if(imgUrl) {
         imgCiaViewer.changeImg(imgUrl);
         this.addHelperLink(fieldGroup);
        }
      }
    });

    console.log(`✅ ${camposOrdenados.length} campos gerados dinamicamente`);
    
    // Configura validação para os campos dinâmicos após gerá-los
    if (FormManager && FormManager.setupDadosEnergiaValidation) {
      FormManager.setupDadosEnergiaValidation();
    }
    
    // Verifica estado inicial do botão
    if (FormManager && FormManager.checkDadosEnergiaCompletion) {
      FormManager.checkDadosEnergiaCompletion();
    }
    
    return true;
  }

  // Cria um grupo de campo dinâmico
  createDynamicFieldGroup(campo) {
    const fieldGroup = document.createElement('div');
    fieldGroup.className = 'form-group';
    fieldGroup.dataset.convenioDadosId = campo.convenioDadosId;

    // Verifica se é um campo de data
    const isDateField = this.isDateField(campo);
    
    if (isDateField) {
      // Cria selects para dia e mês
      const inputId = this.generateDynamicInputId(campo);
      const inputName = this.generateDynamicInputName(campo);
      
      fieldGroup.innerHTML = `
        <label for="${inputId}">${campo.nome}</label>
        <div class="date-selects">
          <select id="${inputId}-dia" name="${inputName}-dia" data-convenio-dados-id="${campo.convenioDadosId}" data-field-type="date-dia">
            <option value="">Dia</option>
            ${this.generateDayOptions()}
          </select>
          <select id="${inputId}-mes" name="${inputName}-mes" data-convenio-dados-id="${campo.convenioDadosId}" data-field-type="date-mes">
            <option value="">Mês</option>
            ${this.generateMonthOptions()}
          </select>
        </div>
      `;
    } else {
      // Campo normal (texto)
      const inputId = this.generateDynamicInputId(campo);
      const placeholder = `Digite ${campo.nome.toLowerCase()}`;

      fieldGroup.innerHTML = `
        <label for="${inputId}">${campo.nome}</label>
        <input 
          type="text" 
          id="${inputId}" 
          name="${inputId}" 
          placeholder="${placeholder}"
          data-convenio-dados-id="${campo.convenioDadosId}"
          data-field-type="${campo.tipo}"
          data-field-format="${campo.formato || ''}"
        />
      `;
    }

    return fieldGroup;
  }

  addHelperLink(fieldGroup) {
    const label = fieldGroup.querySelector(`label`);
    if(label) {
      const labelWithHelper = document.createElement("div");
      const helperLink = document.createElement("a");
      helperLink.href = "#";
      helperLink.classList.add("helper-link");
      helperLink.textContent = "Precisa de ajuda?";
      helperLink.addEventListener("click", () => {
        imgCiaViewer.openImgDialog();
      });
      labelWithHelper.style.cssText = 'display: flex; align-items: center; gap: 4px; justify-content: space-between;';
      helperLink.style.cssText = 'color: var(--primary-color); text-decoration: underline; font-size: 0.8rem; font-weight: 500;';

      fieldGroup.replaceChild(labelWithHelper, label);
      labelWithHelper.appendChild(label);
      labelWithHelper.appendChild(helperLink);
    }
  }

  // Verifica se é um campo de data
  isDateField(campo) {
    // Verifica se o nome do campo contém palavras relacionadas a data
    const dateKeywords = ['data', 'leitura', 'vencimento', 'dia', 'mes', 'mês'];
    const fieldName = campo.nome.toLowerCase();
    
    return dateKeywords.some(keyword => fieldName.includes(keyword)) || 
           campo.tipo === 'date' || 
           (campo.formato && campo.formato.includes('date'));
  }

  // Gera opções para dias (1-31)
  generateDayOptions() {
    let options = '';
    for (let i = 1; i <= 31; i++) {
      const day = i.toString().padStart(2, '0');
      options += `<option value="${day}">${day}</option>`;
    }
    return options;
  }

  // Gera opções para meses (1-12)
  generateMonthOptions() {
    const months = [
      { value: '01', name: 'Janeiro' },
      { value: '02', name: 'Fevereiro' },
      { value: '03', name: 'Março' },
      { value: '04', name: 'Abril' },
      { value: '05', name: 'Maio' },
      { value: '06', name: 'Junho' },
      { value: '07', name: 'Julho' },
      { value: '08', name: 'Agosto' },
      { value: '09', name: 'Setembro' },
      { value: '10', name: 'Outubro' },
      { value: '11', name: 'Novembro' },
      { value: '12', name: 'Dezembro' }
    ];
    
    return months.map(month => 
      `<option value="${month.value}">${month.name}</option>`
    ).join('');
  }

  // Gera nome para o input (sem ID)
  generateDynamicInputName(campo) {
    const cleanName = campo.nome
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `campo-${campo.convenioDadosId}-${cleanName}`;
  }

  // Gera ID único para o input dinâmico
  generateDynamicInputId(campo) {
    const cleanName = campo.nome
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `campo-${campo.convenioDadosId}-${cleanName}`;
  }

  // Configura validação para o campo dinâmico
  setupDynamicFieldValidation(campo) {
    const inputId = this.generateDynamicInputId(campo);
    const input = document.getElementById(inputId);
    
    if (!input) return;

    // Verifica se é um campo de data
    const isDateField = this.isDateField(campo);
    
    if (isDateField) {
      // Configura validação para selects de data
      const diaSelect = document.getElementById(`${inputId}-dia`);
      const mesSelect = document.getElementById(`${inputId}-mes`);
      
      if (diaSelect) {
        diaSelect.addEventListener('change', () => {
          this.validateDateField(diaSelect, mesSelect);
          if (FormManager && FormManager.checkDadosEnergiaCompletion) {
            FormManager.checkDadosEnergiaCompletion();
          }
        });
      }
      
      if (mesSelect) {
        mesSelect.addEventListener('change', () => {
          this.validateDateField(diaSelect, mesSelect);
          if (FormManager && FormManager.checkDadosEnergiaCompletion) {
            FormManager.checkDadosEnergiaCompletion();
          }
        });
      }
    } else {
      // Configura validação para campo normal
      input.addEventListener('input', (e) => {
        this.validateDynamicField(e.target);
        if (FormManager && FormManager.checkDadosEnergiaCompletion) {
          FormManager.checkDadosEnergiaCompletion();
        }
      });

      input.addEventListener('blur', (e) => {
        e.target.dataset.touched = 'true';
        this.validateDynamicField(e.target);
        if (FormManager && FormManager.checkDadosEnergiaCompletion) {
          FormManager.checkDadosEnergiaCompletion();
        }
      });
    }
  }

  // Valida campo de data (dia e mês)
  validateDateField(diaSelect, mesSelect) {
    const dia = diaSelect?.value;
    const mes = mesSelect?.value;
    
    if (dia && mes) {
      // Remove erros se ambos estão preenchidos
      this.clearDynamicFieldError(diaSelect);
      this.clearDynamicFieldError(mesSelect);
      return true;
    } else {
      // Mostra erro se algum está vazio
      if (!dia) {
        this.showDynamicFieldError(diaSelect, 'Selecione o dia');
      }
      if (!mes) {
        this.showDynamicFieldError(mesSelect, 'Selecione o mês');
      }
      return false;
    }
  }

  // Valida um campo dinâmico
  validateDynamicField(input) {
    const valor = input.value.trim();
    const formato = input.dataset.fieldFormat;

    if (!valor) {
      if (input.dataset.touched === 'true') {
        this.showDynamicFieldError(input, 'Campo obrigatório');
      }
      return false;
    } else if (formato && !this.validateDynamicFieldFormat(input, formato)) {
      return false;
    } else {
      this.clearDynamicFieldError(input);
      return true;
    }
  }

  // Valida formato do campo dinâmico
  validateDynamicFieldFormat(input, formato) {
    if (!formato) return true;

    try {
      const regex = new RegExp(formato);
      const value = input.value.trim();
      
      if (value === '') {
        this.clearDynamicFieldError(input);
        return true;
      }

      if (regex.test(value)) {
        this.clearDynamicFieldError(input);
        return true;
      } else {
        this.showDynamicFieldError(input, 'Formato inválido');
        return false;
      }
    } catch (error) {
      console.error('Erro ao validar formato do campo:', error);
      return true;
    }
  }

  // Mostra erro no campo dinâmico
  showDynamicFieldError(input, message) {
    this.clearDynamicFieldError(input);

    input.classList.add('error');

    let errorElement = input.parentElement.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      input.parentElement.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  // Remove erro do campo dinâmico
  clearDynamicFieldError(input) {
    input.classList.remove('error');

    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }

  extractTabelaJurosValores(tabelaJuros) {
    if (!tabelaJuros || !tabelaJuros.tabelaJurosValores) {
      return [];
    }

    // Filtra apenas valores válidos
    const valoresValidos = tabelaJuros.tabelaJurosValores
      .filter(item => item.valor && typeof item.valor === 'number')
      .map(item => ({ valor: item.valor }))
      .sort((a, b) => b.valor - a.valor); // Ordena do maior para o menor

    // Aplica a lógica do código antigo para pegar 5 valores distribuídos
    // return this.formatLoanEqualDivided(valoresValidos);
    return valoresValidos;
  }

  formatLoanEqualDivided(loanArray) {
    // Se o array tem 5 ou menos elementos, retorna todos os valores
    if (loanArray.length <= 5) {
      return loanArray;
    }

    const valuesAbove800 = loanArray.filter((loan) => loan.valor >= 800);

    if (valuesAbove800.length < 5) {
      return valuesAbove800.sort((a, b) => b.valor - a.valor);
    }

    const sortedLoans = [...valuesAbove800].sort((a, b) => b.valor - a.valor);
    const elementsPerGroup = Math.ceil(sortedLoans.length / 5);
    const selectedValues = [];

    // Para cada um dos 5 grupos
    for (let i = 0; i < 5; i++) {
      const startIndex = i * elementsPerGroup;
      const endIndex = Math.min(
        startIndex + elementsPerGroup,
        sortedLoans.length
      );
      const group = sortedLoans.slice(startIndex, endIndex);
      if (group.length > 0) {
        selectedValues.push(group[0]);
      }
    }

    return selectedValues;
  }

  // Extrai e atualiza dados básicos da simulação no DataManager
  extractAndUpdateFromSimulation(simulationData) {
    try {
      const status = simulationData.data.proposta.situacaoDescricao;
      if(!status) return;

      if(status !== 'Aguard. Cadastro' && status !== 'Cancelada' && status !== 'Seleção Oferta') {
        return;
      }
            
      const proposta = simulationData.data.proposta;
      // 1. Atualiza dados básicos da API (propostaId, produtoId, etc.)
      const apiData = {
        propostaId: proposta.id,
        produtoId: 6,
        convenioId: proposta.operacao.convenioId,
        tabelaJurosId: proposta.operacao.tabelaJurosId,
        vencimento: proposta.operacao.vencimento,
        renda: proposta.operacao.renda
      };
      this.data.updateApiData(apiData);
      // 2. Atualiza dados básicos do usuário (cliente)
      const userData = {
        cpf: proposta.cliente.cpf,
        nome: proposta.cliente.nome,
        nascimento: proposta.cliente.nascimento ? proposta.cliente.nascimento.split('T')[0] : '',
        telefone: proposta.contatos.contato.telefone
      };
      this.data.updateUserData(userData);
      // 3. Atualiza dados de endereço
      const addressData = {
        cep: proposta.endereco.cep,
        logradouro: proposta.endereco.logradouro,
        numero: proposta.endereco.numero,
        bairro: proposta.endereco.bairro,
        complemento: proposta.endereco.complemento || "null",
        cidadeId: proposta.endereco.cidadeId
      };
      this.data.updateAddressData(addressData);
      // 4. Atualiza seleções básicas do usuário (operacao)
      const userSelections = {
        valor: proposta.operacao.valorContratado,
        prestacao: proposta.operacao.prestacao,
        plano: proposta.operacao.prazo,
        diaRecebimento: 5 // fixo
      };
      this.data.updateUserSelections(userSelections);
    } catch (error) {
      console.error('❌ Erro ao extrair dados básicos da simulação:', error);
      throw error;
    }
  }

  // Continua fluxo quando status é "Aguard. Cadastro"
  async continueFromAguardCadastro() {
    try {
      // Para o status "Aguard. Cadastro", o usuário já selecionou uma oferta
      // e preencheu os dados da conta de energia, então vamos direto para o sucesso
            
      // Navega para o card de sucesso (agendado automaticamente)
      this.ui.transitionBetweenCards('sucesso', 1);
      
      return { success: true };

    } catch (error) {
      console.error('❌ Erro no fluxo de aguard. cadastro:', error);
      throw error;
    }
  }

  // Lida com status desconhecidos da simulação
  async handleUnknownStatus(status) {
    try {
      return await this.executeOffersAndParcelsFlow();
    } catch (error) {
      console.error('❌ Erro no fluxo para status desconhecido:', error);
      ProposalStorageManager.clearProposalId();
      this.ui.transitionBetweenCards('reprovado', 1);
      return { success: false, error: 'Status desconhecido: ' + status + ' - ' + error.message };
    }
  }

  // Continua fluxo quando status é "Em análise"
  async continueFromEmAnalise() {
    try {
      // Para o status "Em análise", mostra o card específico
      // Navega para o card de em análise (agendado automaticamente)
      this.ui.transitionBetweenCards('em-analise', 1);
      
      return { success: true };

    } catch (error) {
      console.error('❌ Erro no fluxo de em análise:', error);
      throw error;
    }
  }
}

class ProposalStorageManager {
  static STORAGE_KEY = 'slider_proposal_id';
  static EXPIRATION_DAYS = 2;

  static saveProposalId(propostaId) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + this.EXPIRATION_DAYS);
    const data = {
      propostaId: propostaId,
      expiresAt: expirationDate.getTime()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  static getProposalId() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;
      const data = JSON.parse(stored);
      const now = new Date().getTime();
      if (now > data.expiresAt) {
        this.clearProposalId();
        return null;
      }
      return data.propostaId;
    } catch (error) {
      this.clearProposalId();
      return null;
    }
  }

  static clearProposalId() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static hasValidProposal() {
    return this.getProposalId() !== null;
  }
}

class DocumentUploadManager {
  constructor() {
    this.setupUploads();
  }

  setupUploads() {
    this.setupLegacyUploads();
    this.setupModernUploads();
    this.setupUploadRows();
  }

  setupLegacyUploads() {
    // Upload de imagens - preview e remover (versão legada)
    this.setupImageUpload('upload-conta-luz', 'preview-conta-luz');
    this.setupImageUpload('upload-id-frente', 'preview-id-frente');
    this.setupImageUpload('upload-id-verso', 'preview-id-verso');
  }

  setupImageUpload(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    if (!input || !preview) return;

    input.addEventListener('change', function () {
      preview.innerHTML = '';
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = document.createElement('img');
          img.src = e.target.result;
          img.alt = 'Pré-visualização';
          const removeBtn = document.createElement('button');
          removeBtn.textContent = 'Remover';
          removeBtn.className = 'remove-img-btn';
          removeBtn.onclick = function (ev) {
            ev.preventDefault();
            input.value = '';
            preview.innerHTML = '';            
          };
          preview.appendChild(img);
          preview.appendChild(removeBtn);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  setupModernUploads() {
    this.setupModernImageUpload('box-conta-luz', 'upload-conta-luz', 'placeholder-conta-luz', 'fileinfo-conta-luz');
    this.setupModernImageUpload('box-id-frente', 'upload-id-frente', 'placeholder-id-frente', 'fileinfo-id-frente');
    this.setupModernImageUpload('box-id-verso', 'upload-id-verso', 'placeholder-id-verso', 'fileinfo-id-verso');
  }

  setupModernImageUpload(boxId, inputId, placeholderId, fileInfoId) {
    const box = document.getElementById(boxId);
    const input = document.getElementById(inputId);
    const placeholder = document.getElementById(placeholderId);
    const fileInfo = document.getElementById(fileInfoId);
    if (!box || !input || !placeholder || !fileInfo) return;

    box.addEventListener('click', function (e) {
      if (e.target.classList.contains('upload-remove-btn')) return;
      input.click();
    });
    input.addEventListener('click', function(e) { e.stopPropagation(); });

    input.addEventListener('change', function () {
      box.querySelectorAll('.upload-preview-img').forEach(el => el.remove());
      fileInfo.innerHTML = '';
      fileInfo.style.display = 'none';
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
          placeholder.style.display = 'none';
          const img = document.createElement('img');
          img.src = e.target.result;
          img.className = 'upload-preview-img';
          img.alt = 'Pré-visualização';
          box.appendChild(img);
          // File info
          const nameSpan = document.createElement('span');
          nameSpan.className = 'upload-file-name';
          nameSpan.textContent = file.name;
          const sizeSpan = document.createElement('span');
          sizeSpan.className = 'upload-file-size';
          sizeSpan.textContent = this.formatFileSize(file.size);
          const removeBtn = document.createElement('button');
          removeBtn.type = 'button';
          removeBtn.innerHTML = '&times;';
          removeBtn.className = 'upload-remove-btn';
          removeBtn.onclick = function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            input.value = '';
            img.remove();
            fileInfo.innerHTML = '';
            fileInfo.style.display = 'none';
            placeholder.style.display = '';
          };
          fileInfo.appendChild(nameSpan);
          fileInfo.appendChild(sizeSpan);
          fileInfo.appendChild(removeBtn);
          fileInfo.style.display = 'flex';
        }.bind(this);
        reader.readAsDataURL(file);
      } else {
        placeholder.style.display = '';
        fileInfo.innerHTML = '';
        fileInfo.style.display = 'none';
      }
    }.bind(this));
  }

  setupUploadRows() {
    const uploadConfigs = [
      {
        boxId: 'box-conta-luz',
        inputId: 'upload-conta-luz',
        placeholderId: 'placeholder-conta-luz',
        imgId: 'img-conta-luz',
        nameId: 'name-conta-luz',
        sizeId: 'size-conta-luz',
        removeId: 'remove-conta-luz',
        docLabel: 'Conta de Luz'
      },
      {
        boxId: 'box-id-frente',
        inputId: 'upload-id-frente',
        placeholderId: 'placeholder-id-frente',
        imgId: 'img-id-frente',
        nameId: 'name-id-frente',
        sizeId: 'size-id-frente',
        removeId: 'remove-id-frente',
        docLabel: 'RG - Frente'
      },
      {
        boxId: 'box-id-verso',
        inputId: 'upload-id-verso',
        placeholderId: 'placeholder-id-verso',
        imgId: 'img-id-verso',
        nameId: 'name-id-verso',
        sizeId: 'size-id-verso',
        removeId: 'remove-id-verso',
        docLabel: 'RG - Verso'
      }
    ];

    uploadConfigs.forEach(config => {
      this.setupUploadRow(config);
    });
  }

  setupUploadRow(config) {
    const { boxId, inputId, placeholderId, imgId, nameId, sizeId, removeId, docLabel } = config;
    const box = document.getElementById(boxId);
    const input = document.getElementById(inputId);
    const placeholder = document.getElementById(placeholderId);
    const img = document.getElementById(imgId);
    const name = document.getElementById(nameId);
    const size = document.getElementById(sizeId);
    const remove = document.getElementById(removeId);
    if (!box || !input || !placeholder || !img || !name || !size || !remove) return;

    const reset = () => {
      img.style.display = 'none';
      img.src = '';
      placeholder.style.display = '';
      name.textContent = docLabel;
      size.style.display = 'none';
      remove.style.display = 'none';
    };

    box.addEventListener('click', function (e) {
      if (e.target === remove) return;
      input.click();
    });
    input.addEventListener('click', function(e) { e.stopPropagation(); });

    input.addEventListener('change', function () {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
          img.src = e.target.result;
          img.style.display = 'block';
          placeholder.style.display = 'none';
          name.textContent = file.name;
          size.textContent = this.formatFileSize(file.size);
          size.style.display = 'block';
          remove.style.display = 'flex';
        }.bind(this);
        reader.readAsDataURL(file);
      } else {
        reset();
      }
    }.bind(this));

    remove.addEventListener('click', function(ev) {
      ev.stopPropagation();
      ev.preventDefault();
      input.value = '';
      reset();
      if (typeof flowManager !== 'undefined') {
        if (inputId === 'upload-conta-luz') flowManager.data.updateUserDocument('contaLuz', null);
        if (inputId === 'upload-id-frente') flowManager.data.updateUserDocument('idFrente', null);
        if (inputId === 'upload-id-verso') flowManager.data.updateUserDocument('idVerso', null);
        FormManager.checkUploadImagensCompletion();
      }
    });

    reset();
  }

  formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}

class CustomSearchSelect {
  constructor(selector = 'select[data-search-select="true"]') {
    this.isBottomSheetOpen = false;
    this.initAll(selector);
  }

  initAll(selector) {
    document.querySelectorAll(selector).forEach(select => this.setupWithObserver(select));
  }

  setupWithObserver(select) {
    // Cria o custom select inicialmente
    this.initSelect(select);

    // Cria o observer para detectar mudanças nas opções
    const observer = new MutationObserver(() => {
      // Remove o custom select antigo, se existir
      const oldCustom = select.parentElement.querySelector('.custom-search-select');
      if (oldCustom) oldCustom.remove();
      // Cria novamente o custom select
      this.initSelect(select);
    });

    observer.observe(select, { childList: true });
  }

  initSelect(select) {
    // Esconde o select original
    select.style.display = 'none';
 
    // Cria o container customizado
    const container = document.createElement('div');
    container.className = 'custom-search-select';

    if (!select.value) {
      container.classList.add('custom-search-select--empty');
    }

    select.addEventListener('change', () => {
      if (select.value) {
        container.classList.remove('custom-search-select--empty');
      } else {
        container.classList.add('custom-search-select--empty');
      }
    });

    // Cria o input de busca
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'custom-search-input';
    input.placeholder = select.options[0]?.text || 'Selecione';

    // Cria a lista de opções
    const dropdown = document.createElement('div');
    dropdown.className = 'custom-search-dropdown';

    // Preenche as opções
    const options = Array.from(select.options).slice(1); // ignora o primeiro (placeholder)
    this.renderOptions(options, dropdown, input, select);

    // Eventos de busca
    input.addEventListener('input', () => {
      const search = input.value.toLowerCase();
      this.renderOptions(options, dropdown, input, select, search);
    });

    // Fecha dropdown ao clicar fora
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) dropdown.style.display = 'none';
    });

    // Monta o componente
    container.appendChild(input);
    container.appendChild(dropdown);
    select.parentNode.insertBefore(container, select.nextSibling);

    // Sincroniza valor inicial
    if (select.value) {
      const selected = options.find(opt => opt.value === select.value);
      if (selected) input.value = selected.text;
    }

    const handleFocus = () => {
      input.select(); // seleciona todo o texto ao focar
      dropdown.style.display = 'block';
      container.classList.add('open');
      this.renderOptions(options, dropdown, input, select, '');
    }

    const handleFocusMobile = (e) => {
      if (this.isBottomSheetOpen) return;
      e.preventDefault();
      this.openBottomSheet(select, input);
    }

    window.addEventListener('resize', () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (isMobile) {
        input.removeEventListener('focus', handleFocus);
        input.addEventListener('focus', handleFocusMobile);
      } else {
        input.removeEventListener('focus', handleFocusMobile);
        input.addEventListener('focus', handleFocus);
      }
    });

    const isMobile = window.innerWidth <= 768;
    input.addEventListener('focus', isMobile ? handleFocusMobile : handleFocus);
  }

  removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  renderOptions(options, dropdown, input, select, search = '') {
    dropdown.innerHTML = '';
    const searchWithoutAccents = this.removeAccents(search).toLowerCase();    
    const filtered = options.filter(opt => this.removeAccents(opt.text).toLowerCase().includes(searchWithoutAccents));
    if (filtered.length === 0) {
      const noOpt = document.createElement('div');
      noOpt.className = 'custom-search-option disabled';
      noOpt.textContent = 'Nenhuma opção encontrada';
      dropdown.appendChild(noOpt);
      return;
    }
    filtered.forEach(opt => {
      const div = document.createElement('div');
      div.className = 'custom-search-option';
      div.textContent = opt.text;
      div.addEventListener('mousedown', () => {
        input.value = opt.text;
        select.value = opt.value;
        dropdown.style.display = 'none';
        // Dispara evento de mudança no select original
        select.dispatchEvent(new Event('change'));
      });
      dropdown.appendChild(div);
    });
  }

  openBottomSheet(select, input) {
    // 1. Pega o label do select
    const labelEl = document.querySelector(`label[for='${select.id}']`);
    const labelText = labelEl ? labelEl.textContent : 'Selecione';

    // 2. Pega as opções do select
    const options = Array.from(select.options).slice(1); // ignora placeholder

    // 3. Preenche o bottom sheet
    const dialog = document.getElementById('bottom-sheet-dialog');
    dialog.querySelector('.bottom-sheet-label').textContent = labelText;

    if (this.isBottomSheetOpen) return; // Evita abrir múltiplas vezes
    this.isBottomSheetOpen = true;

    // Função para renderizar as opções filtradas
    const renderFilteredOptions = (filter = '') => {
      const ul = dialog.querySelector('.bottom-sheet-list');
      ul.innerHTML = '';
      const searchWithoutAccents = this.removeAccents(filter).toLowerCase();    
      const filtered = options.filter(opt => this.removeAccents(opt.text).toLowerCase().includes(searchWithoutAccents));
      if (filtered.length === 0) {
        const li = document.createElement('li');
        li.className = 'bottom-sheet-option disabled';
        li.textContent = 'Nenhuma opção encontrada';
        ul.appendChild(li);
        return;
      }
      filtered.forEach(opt => {
        const li = document.createElement('li');
        li.className = 'bottom-sheet-option';
        li.textContent = opt.text;
        li.addEventListener('click', (e) => {
          e.preventDefault();
          // Atualiza o select original
          select.value = opt.value;
          // Atualiza o input customizado
          input.value = opt.text;
          // Dispara evento change
          select.dispatchEvent(new Event('change'));
          // Fecha o dialog
          dialog.close();
        });
        ul.appendChild(li);
      });
    }

    // Limpa o campo de busca
    const searchInput = dialog.querySelector('.bottom-sheet-input');
    searchInput.value = '';
    renderFilteredOptions();

    // Remove event listeners antigos para evitar duplicidade
    searchInput.oninput = null;

    // Adiciona evento de busca
    searchInput.oninput = function() {
      renderFilteredOptions(this.value);
    };

    // Abre o dialog
    dialog.showModal();
    // Foca no input de busca ao abrir
    setTimeout(() => searchInput.focus(), 100);

    dialog.addEventListener('close', () => {
      this.isBottomSheetOpen = false;
      // Remove o foco do input customizado para evitar reabrir
      input.blur();
    }, { once: true });
  }
}

class StateSelectHelper {
  static estados = [
    { id: 1, uf: "AC", nome: "Acre" },
    { id: 2, uf: "AL", nome: "Alagoas" },
    { id: 3, uf: "AP", nome: "Amapá" },
    { id: 4, uf: "AM", nome: "Amazonas" },
    { id: 5, uf: "BA", nome: "Bahia" },
    { id: 6, uf: "CE", nome: "Ceará" },
    { id: 7, uf: "DF", nome: "Distrito Federal" },
    { id: 8, uf: "ES", nome: "Espírito Santo" },
    { id: 9, uf: "GO", nome: "Goiás" },
    { id: 10, uf: "MA", nome: "Maranhão" },
    { id: 11, uf: "MT", nome: "Mato Grosso" },
    { id: 12, uf: "MS", nome: "Mato Grosso do Sul" },
    { id: 13, uf: "MG", nome: "Minas Gerais" },
    { id: 14, uf: "PA", nome: "Pará" },
    { id: 15, uf: "PB", nome: "Paraíba" },
    { id: 16, uf: "PR", nome: "Paraná" },
    { id: 17, uf: "PE", nome: "Pernambuco" },
    { id: 18, uf: "PI", nome: "Piauí" },
    { id: 19, uf: "RJ", nome: "Rio de Janeiro" },
    { id: 20, uf: "RN", nome: "Rio Grande do Norte" },
    { id: 21, uf: "RS", nome: "Rio Grande do Sul" },
    { id: 22, uf: "RO", nome: "Rondônia" },
    { id: 23, uf: "RR", nome: "Roraima" },
    { id: 24, uf: "SC", nome: "Santa Catarina" },
    { id: 25, uf: "SP", nome: "São Paulo" },
    { id: 26, uf: "SE", nome: "Sergipe" },
    { id: 27, uf: "TO", nome: "Tocantins" }
  ];

  // Cria e popula um select de estados
  static createSelectEstado(selectElement, placeholder = 'Selecione') {
    selectElement.innerHTML = `<option value="">${placeholder}</option>`;
    this.estados.forEach(estado => {
      const option = document.createElement('option');
      option.value = estado.id; // Salva o id para uso posterior
      option.textContent = estado.nome;
      option.setAttribute('data-uf', estado.uf); // Facilita busca de cidades
      selectElement.appendChild(option);
    });
  }

  // Retorna o UF a partir do id do estado
  static getUfById(id) {
    const estado = this.estados.find(e => String(e.id) === String(id));
    return estado ? estado.uf : '';
  }

  // Retorna o nome do estado a partir do id
  static getNomeById(id) {
    const estado = this.estados.find(e => String(e.id) === String(id));
    return estado ? estado.nome : '';
  }
}

class RetryManager {
  constructor() {
    this.lastOperation = null;
  }

  // Registra a operação que pode ser reexecutada
  register(operationFn, ...args) {
    this.lastOperation = { operationFn, args };
  }

  // Executa a última operação registrada
  async retryLast() {
    if (!this.lastOperation) return { success: false, error: 'Nenhuma operação para retry' };
    try {
      return await this.lastOperation.operationFn(...this.lastOperation.args);
    } catch (err) {
      return { success: false, error: err };
    }
  }

  clear() {
    this.lastOperation = null;
  }
}

class ImgCiaViewer {
  constructor() {
    this.zoomed = false;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.imgX = 0;
    this.imgY = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.lastMoveTime = 0;
    this.lastMoveX = 0;
    this.lastMoveY = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.scale = 2; // Fator de zoom
  }

  init() {
    this.setup();
  }

  setup() {
    this.dialog = document.querySelector('#img-cia-dialog');
    this.img = this.dialog.querySelector('#img-cia-main');
    this.btnZoom = this.dialog.querySelector('#btn-zoom');
    this.btnClose = this.dialog.querySelector('#btn-close');

    this.btnZoom.addEventListener('click', () => this.toggleZoom());
    this.btnClose.addEventListener('click', () => this.close());
    
    // Event listeners para mouse
    this.img.addEventListener('mousedown', (e) => this.onPointerDown(e));
    document.addEventListener('mousemove', (e) => this.onPointerMove(e));
    document.addEventListener('mouseup', () => this.onPointerUp());
    
    // Event listeners para touch
    this.img.addEventListener('touchstart', (e) => this.onPointerDown(e));
    document.addEventListener('touchmove', (e) => this.onPointerMove(e));
    document.addEventListener('touchend', () => this.onPointerUp());
    
    // Prevenir zoom do navegador em dispositivos touch
    this.img.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    this.img.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    document.addEventListener("resize", () => {
      this.scale = window.innerWidth < 600 ? 3.5 : 2;
      this.updateTransform(true);
    });
  }

  getLimits() {
    const wrapper = this.img.parentElement;
    const wrapperRect = wrapper.getBoundingClientRect();
    const displayWidth = this.img.width;
    const displayHeight = this.img.height;
    const zoomedWidth = displayWidth * this.scale;
    const zoomedHeight = displayHeight * this.scale;
    const maxX = Math.max(0, (zoomedWidth - wrapperRect.width) / 2);
    const maxY = Math.max(0, (zoomedHeight - wrapperRect.height) / 2);
    return { maxX, maxY };
  }

  clampWithResistance(value, limit) {
    const resistance = 0.35;
    if (value < -limit) return -limit + (value + limit) * resistance;
    if (value > limit) return limit + (value - limit) * resistance;
    return value;
  }

  clamp(value, limit) {
    return Math.max(-limit, Math.min(limit, value));
  }

  updateTransform(animated = false) {
    if (animated) {
      gsap.to(this.img, {
        scale: this.zoomed ? this.scale : 1,
        x: this.zoomed ? this.imgX : 0,
        y: this.zoomed ? this.imgY : 0,
        duration: 0.4,
        ease: "power2.out"
      });
    } else {
      gsap.set(this.img, {
        scale: this.zoomed ? this.scale : 1,
        x: this.zoomed ? this.imgX : 0,
        y: this.zoomed ? this.imgY : 0
      });
    }
  }

  toggleZoom() {
    this.zoomed = !this.zoomed;
    if (this.zoomed) {
      this.imgX = 0;
      this.imgY = 0;
      this.img.classList.add('zoomed');
      this.updateTransform(true);
    } else {
      this.img.classList.remove('zoomed');
      this.imgX = 0;
      this.imgY = 0;
      this.updateTransform(true);
    }
  }

  close() {
    this.dialog.close();
  }

  getPointerPosition(e) {
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
    return {
      x: e.clientX,
      y: e.clientY
    };
  }

  onPointerDown(e) {
    if (!this.zoomed) return;
    e.preventDefault();
    gsap.killTweensOf(this.img);
    this.isDragging = true;
    
    const pos = this.getPointerPosition(e);
    this.startX = pos.x;
    this.startY = pos.y;
    this.lastX = this.imgX;
    this.lastY = this.imgY;
    
    // Apenas para mouse
    if (e.type === 'mousedown') {
      this.img.style.cursor = 'grabbing';
    }
    
    this.lastMoveTime = Date.now();
    this.lastMoveX = this.startX;
    this.lastMoveY = this.startY;
    this.velocityX = 0;
    this.velocityY = 0;
  }

  onPointerMove(e) {
    if (!this.isDragging || !this.zoomed) return;
    e.preventDefault();
    
    const pos = this.getPointerPosition(e);
    const { maxX, maxY } = this.getLimits();
    let dx = pos.x - this.startX;
    let dy = pos.y - this.startY;
    this.imgX = this.clampWithResistance(this.lastX + dx, maxX);
    this.imgY = this.clampWithResistance(this.lastY + dy, maxY);
    this.updateTransform(false);

    // Calcular velocidade
    const now = Date.now();
    const dt = now - this.lastMoveTime;
    if (dt > 0) {
      this.velocityX = (pos.x - this.lastMoveX) / dt;
      this.velocityY = (pos.y - this.lastMoveY) / dt;
      this.lastMoveTime = now;
      this.lastMoveX = pos.x;
      this.lastMoveY = pos.y;
    }
  }

  onPointerUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    // Apenas para mouse
    if (this.img.style.cursor) {
      this.img.style.cursor = 'grab';
    }

    // Inércia ao soltar
    const { maxX, maxY } = this.getLimits();
    let targetX = this.imgX + this.velocityX * 300; // 300 = fator de inércia
    let targetY = this.imgY + this.velocityY * 300;

    // Clamp para não sair dos limites
    targetX = this.clamp(targetX, maxX);
    targetY = this.clamp(targetY, maxY);

    gsap.to(this.img, {
      x: targetX,
      y: targetY,
      scale: this.scale,
      duration: 0.7,
      ease: "power2.out",
      onUpdate: () => {
        // Atualiza imgX/imgY para manter o estado correto
        this.imgX = gsap.getProperty(this.img, "x");
        this.imgY = gsap.getProperty(this.img, "y");
      }
    });
  }

  changeImg(imgUrl = "") {
    this.img.src = imgUrl;
  }

  openImgDialog() {
    this.dialog.showModal();
  }
}


function setupFlow() {
  // http://localhost:3000, https://api.crediconfiance.com.br
  const apiManager = new ApiManager("https://api.crediconfiance.com.br", false); 
  const dataManager = new DataManager();
  const validator = new FlowValidator();
  const navigator = new FlowNavigator();
  const uiManager = new UIManager();
  return new FlowManager(apiManager, dataManager, validator, navigator, uiManager);
}

const flowManager = setupFlow();
const retryManager = new RetryManager();
// Inicializar o visualizador de imagem da companhia
const imgCiaViewer = new ImgCiaViewer();

// Inicialização automática ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  FormManager.init();
  imgCiaViewer.init();

  // Inicializar o gerenciador de upload de documentos
  new DocumentUploadManager();
  
  // Popula todos os selects de estado automaticamente
  document.querySelectorAll('select[data-estado-select="true"]')
  .forEach((select) => StateSelectHelper.createSelectEstado(select));

  // Cria um select customizado
  new CustomSearchSelect();
  
  // Verifica se existe uma proposta salva no localStorage
  if (ProposalStorageManager.hasValidProposal()) {
    flowManager.ui.showCardInstant('continuar');
  } else {
    flowManager.ui.showCardInstant('formulario');
  }
});
