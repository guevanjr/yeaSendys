const axios = require('axios');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ explicitArray: false });

var tokenUrl = 'http://crm.aqi.co.mz/SendysCRM/webservices/SecurityManager.asmx';
var tokenRequest = '<?xml version="1.0" encoding="utf-8"?>\
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
<soap:Body>\
<Login xmlns="capgemini.crm.webservices.securitymanager">\
<Login_Input>\
<Username>userpbx</Username>\
<Password>N0EwS0@a5E*DC</Password>\
</Login_Input></Login>\
</soap:Body>\
</soap:Envelope>';

/* === DONE === */
exports.getCustomer = async function (req, res) {
    var searchParameter = req.query.parameter;
    var searchValue = req.query.value;

    axios.post(tokenUrl, tokenRequest, { 
        headers:
             {'Content-Type': 'text/xml'}
        }
    ).then(response => {
        var xmlData = response.data;
        parser.parseString(xmlData, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return;
            }
            // Accessing data within the envelope
            var isGranted = result['soap:Envelope']['soap:Body'].LoginResponse.LoginResult.AccessGranted;
            var token = result['soap:Envelope']['soap:Body'].LoginResponse.LoginResult.Token;
            var requestBody = '';

            console.log('\nIs Granted: ' + isGranted);
            console.log('Token: ' + token);    
            console.log('Search Parameter: ' + searchParameter);
            console.log('Search Value: ' + searchValue);

            switch (searchParameter) {
                case 'NAME':
                    requestBody = '<soap:Body>\
                        <QueryByNome xmlns="capgemini/crm/webservices/cliente">\
                        <input>\
                            <Nome>' + searchValue + '</Nome>\
                        </input>\
                        </QueryByNome>\
                    </soap:Body>';
                break;

                case 'PHONE':
                    requestBody = '<soap:Body>\
                        <QueryByPhone xmlns="capgemini/crm/webservices/cliente">\
                        <input>\
                            <Phone>' + searchValue + '</Phone>\
                        </input>\
                        </QueryByPhone>\
                    </soap:Body>';
                break;
                case 'ID':
                break;
                default:
                break;
            }

            var userUrl = 'http://crm.aqi.co.mz/SendysCRM/webservices/Cliente.asmx';
            var userRequest = '<?xml version="1.0" encoding="utf-8"?>\
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
            <soap:Header>\
                <AuthenticationHeader xmlns="capgemini/crm/webservices/cliente">\
                <TokenId>' + token + '</TokenId>\
                </AuthenticationHeader>\
            </soap:Header>' + requestBody + '</soap:Envelope>';

            axios.post(userUrl, userRequest, {
                headers:
                    {'Content-Type': 'text/xml'}
                }
            ).then(userResponse => {
                console.log(userResponse.data);
                var xmlResult = userResponse.data;

                parser.parseString(xmlResult, (err, result) => {
                    if (err) {
                        console.error('Error parsing XML:', err);
                        return;
                    }

                    res.send({ data: result['soap:Envelope']['soap:Body'].QueryByPhoneResponse.QueryByPhoneResult.ContactosNoCliente.ContactoNoCliente_Data});
                })

            }).catch(userError => {
                console.log('\nError: \n' + userError);
                res.send({
                    code: userError.code,
                    status: userError.response.status,
                    data: userError.response.data
                })
            })
        });

        //console.log('\n*** ===== FULL RESPONSE === ***\n' + response.data);
    }).catch(error => {
        console.log(error);
    })
}

/* ==== DONE ==== */
exports.insertCustomer = async function (req, res) {
    axios.post(tokenUrl, tokenRequest, { 
        headers:
             {'Content-Type': 'text/xml'}
        }
    ).then(response => {
        var xmlData = response.data;
        parser.parseString(xmlData, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return;
            }
            // Accessing data within the envelope
            var isGranted = result['soap:Envelope']['soap:Body'].LoginResponse.LoginResult.AccessGranted;
            var token = result['soap:Envelope']['soap:Body'].LoginResponse.LoginResult.Token;

            console.log('\nIs Granted: ' + isGranted);
            console.log('Token: ' + token);    

            var userUrl = 'http://crm.aqi.co.mz/SendysCRM/webservices/Cliente.asmx';/*
            var userRequest = '<?xml version="1.0" encoding="utf-8"?>\
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
            <soap:Header>\
                <AuthenticationHeader xmlns="capgemini/crm/webservices/cliente">\
                <TokenId>' + token + '</TokenId>\
                </AuthenticationHeader>\
            </soap:Header>\
            <soap:Body>\
                <Insert xmlns="capgemini/crm/webservices/cliente">\
                <input>\
                    <IdFirma>1</IdFirma>\
                    <IdNumeracaoAutomatica>1</IdNumeracaoAutomatica>\
                    <Nome>' + req.query.firstname + '</Nome>\
                    <SegundoNome>' + req.query.lastname + '</SegundoNome>\
                    <Numero>1</Numero>\
                    <IdDistribuidor>1</IdDistribuidor>\
                    <Descricao></Descricao>\
                    <DescricaoPrivada></DescricaoPrivada>\
                    <InformacaoUrgente></InformacaoUrgente>\
                    <WebSite></WebSite>\
                    <IdZona>86</IdZona>\
                    <IdCAE>714</IdCAE>\
                    <IdCAE2>714</IdCAE2>\
                    <NIB></NIB>\
                    <NIF></NIF>\
                    <Distribuidor>false</Distribuidor>\
                    <IDEstadoCliente>1</IDEstadoCliente>\
                    <IdUtilizador_Vendedor>82</IdUtilizador_Vendedor>\
                    <IdActividade>214</IdActividade>\
                    <IdNumEmpregados>7</IdNumEmpregados>\
                    <IdVolumeNegocios>5</IdVolumeNegocios>\
                    <IdPrioridade>4</IdPrioridade>\
                    <DataInicio>' + new Date().toISOString() + '</DataInicio>\
                    <DataFim>' + new Date().toISOString() + '</DataFim>\
                    <DataInicioActividade>' + new Date().toISOString() + '</DataInicioActividade>\
                    <IBAN></IBAN>\
                </input>\
                </Insert>\
            </soap:Body>\
            </soap:Envelope>';
*/
            var userRequest = '<?xml version="1.0" encoding="utf-8"?>\
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
            <soap:Header>\
                <AuthenticationHeader xmlns="capgemini/crm/webservices/cliente">\
                <TokenId>' + token + '</TokenId>\
                </AuthenticationHeader>\
            </soap:Header>\
            <soap:Body>\
                <InserirCliente xmlns="capgemini/crm/webservices/cliente">\
                <cliente>\
                    <NumContactosCliente>0</NumContactosCliente>\
                    <NumTarefas>0</NumTarefas>\
                    <NumPendentes>0</NumPendentes>\
                    <NumOportunidades>0</NumOportunidades>\
                    <NumRelatorios>0</NumRelatorios>\
                    <NumProjetos>0</NumProjetos>\
                    <NumContactos>1</NumContactos>\
                    <NumMoradas>1</NumMoradas>\
                    <NumContratos>0</NumContratos>\
                    <Descricao></Descricao>\
                    <Estado>5</Estado>\
                    <EstadoDescricao></EstadoDescricao>\
                    <DiasSPG>1</DiasSPG>\
                    <Morada>' + req.query.address + '</Morada>\
                    <Localidade>' + req.query.city + '</Localidade>\
                    <CodigoPostal></CodigoPostal>\
                    <Website>' + req.query.website + '</Website>\
                    <Email>' +  req.query.email + '</Email>\
                    <Telefone>' + req.query.phone + '</Telefone>\
                    <Telemovel>' + req.query.mobile + '</Telemovel>\
                    <Distribuidor></Distribuidor>\
                    <EDistribuidor>false</EDistribuidor>\
                    <IdDistribuidor>1</IdDistribuidor>\
                    <ZonaCliente>86</ZonaCliente>\
                    <Rota>1</Rota>\
                    <Comercial>1</Comercial>\
                    <DataAlteracao>' + new Date().toISOString() + '</DataAlteracao>\
                    <DataSync>' + new Date().toISOString() + '</DataSync>\
                    <IBAN></IBAN>\
                    <GDIdPasta>1</GDIdPasta>\
                    <IdCAE2>714</IdCAE2>\
                    <IdNumEmpregados>7</IdNumEmpregados>\
                    <IdUtilizador_C>82</IdUtilizador_C>\
                </cliente>\
                <userid>82</userid>\
                </InserirCliente>\
            </soap:Body>\
            </soap:Envelope>';

            axios.post(userUrl, userRequest, {
                headers:
                    {'Content-Type': 'text/xml'}
                }
            ).then(userResponse => {
                console.log(userResponse.data);
                var xmlResult = userResponse.data;

                parser.parseString(xmlResult, (err, result) => {
                    if (err) {
                        console.error('Error parsing XML:', err);
                        return;
                    }

                    res.send({ data: result['soap:Envelope']['soap:Body']/*.QueryByPhoneResponse.QueryByPhoneResult.ContactosNoCliente.ContactoNoCliente_Data*/});
                })

            }).catch(userError => {
                console.log('\nError: \n' + userError);
                res.send({
                    code: userError.code,
                    status: userError.response.status,
                    data: userError.response.data
                })
            })
        });

        //console.log('\n*** ===== FULL RESPONSE === ***\n' + response.data);
    }).catch(error => {
        console.log(error);
    })
}

/*
exports.getUser = async function (req, res) {
    axios.post(tokenUrl, tokenRequest, { 
        headers:
             {'Content-Type': 'text/xml'}
        }
    ).then(response => {
        var xmlData = response.data;
        parser.parseString(xmlData, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return;
            }
            // Accessing data within the envelope
            var isGranted = result['soap:Envelope']['soap:Body'].LoginResponse.LoginResult.AccessGranted;
            var token = result['soap:Envelope']['soap:Body'].LoginResponse.LoginResult.Token;
            console.log('\nIs Granted: ' + isGranted);
            console.log('Token: ' + token);    
            
            var userUrl = 'http://crm.aqi.co.mz/SendysCRM/webservices/Utilizador.asmx';
            var userRequest = '<?xml version="1.0" encoding="utf-8"?>\
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
            <soap:Header>\
                <AuthenticationHeader xmlns="capgemini/crm/webservices/utilizador">\
                <TokenId>' + token + '</TokenId>\
                </AuthenticationHeader>\
            </soap:Header>\
            <soap:Body>\
                <GetActive xmlns="capgemini/crm/webservices/utilizador">\
                <input />\
                </GetActive>\
            </soap:Body>\
            </soap:Envelope>';

            axios.post(userUrl, userRequest, {
                headers:
                    {'Content-Type': 'text/xml'}
                }
            ).then(userResponse => {
                console.log(userResponse.data);
            }).catch(userError => {
                //console.log(userError.code);
                res.send({
                    code: userError.code,
                    status: userError.response.status,
                    data: userError.response.data
                })
            })
        });

        //console.log('\n*** ===== FULL RESPONSE === ***\n' + response.data);
    }).catch(error => {
        console.log(error);
    })
}
*/

exports.getContacts = async function (req, res) {
}

/* === DONE === */
exports.addTasks = async function (req, res) {
    axios.post(tokenUrl, tokenRequest, { 
        headers:
             {'Content-Type': 'text/xml'}
        }
    ).then(response => {
        var xmlData = response.data;
        parser.parseString(xmlData, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return;
            }
            // Accessing data within the envelope
            var isGranted = result['soap:Envelope']['soap:Body'].LoginResponse.LoginResult.AccessGranted;
            var token = result['soap:Envelope']['soap:Body'].LoginResponse.LoginResult.Token;
            console.log('\nIs Granted: ' + isGranted);
            console.log('Token: ' + token);    
            
            var userUrl = 'http://crm.aqi.co.mz/SendysCRM/webservices/Tarefa.asmx';
            var userRequest = '<?xml version="1.0" encoding="utf-8"?>\
            <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\
            <soap12:Header>\
                <AuthenticationHeader xmlns="capgemini/crm/webservices/tarefa">\
                <TokenId>' + token + '</TokenId>\
                </AuthenticationHeader>\
            </soap12:Header>\
            <soap12:Body>\
                <Insert xmlns="capgemini/crm/webservices/tarefa">\
                <input>\
                    <IdCliente>' + req.query.customerId + '</IdCliente>\
                    <IdUtilizador>82</IdUtilizador>\
                    <IdEstadoTarefa>1</IdEstadoTarefa>\
                    <IdTipoTarefa>4</IdTipoTarefa>\
                    <Nome>' + req.query.name + '</Nome>\
                    <Descricao>' + req.query.description + '</Descricao>\
                    <Inicio>' + new Date().toISOString() + '</Inicio>\
                    <Fim>' + new Date().toISOString() + '</Fim>\
                    <IncluirNaAgenda>true</IncluirNaAgenda>\
                    <IdAreaRelacionada>7</IdAreaRelacionada>\
                    <IdUtilizador_C>82</IdUtilizador_C>\
                </input>\
                </Insert>\
            </soap12:Body>\
            </soap12:Envelope>';

            axios.post(userUrl, userRequest, {
                headers:
                    {'Content-Type': 'text/xml'}
                }
            ).then(userResponse => {
                console.log(userResponse.data);
                
                var xmlResult = userResponse.data;

                parser.parseString(xmlResult, (err, result) => {
                    if (err) {
                        console.error('Error parsing XML:', err);
                        return;
                    }

                    res.send({ data: result['soap:Envelope']['soap:Body']});
                })

            }).catch(userError => {
                //console.log(userError.code);
                res.send({
                    code: userError.code,
                    status: userError.response.status,
                    data: userError.response.data
                })
            })
        });

        //console.log('\n*** ===== FULL RESPONSE === ***\n' + response.data);
    }).catch(error => {
        console.log(error);
    })

}

exports.addCallDetails = async function (req, res) {
    axios.post(tokenUrl, tokenRequest, { 
        headers:
             {'Content-Type': 'text/xml'}
        }
    ).then(response => {
        var xmlData = response.data;
        parser.parseString(xmlData, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return;
            }
            // Accessing data within the envelope
            var isGranted = result['soap:Envelope']['soap:Body'].LoginResponse.LoginResult.AccessGranted;
            var token = result['soap:Envelope']['soap:Body'].LoginResponse.LoginResult.Token;
            console.log('\nIs Granted: ' + isGranted);
            console.log('Token: ' + token);    
            
            var userUrl = 'http://crm.aqi.co.mz/SendysCRM/webservices/AreaRelacionada.asmx';
            var userRequest = '<?xml version="1.0" encoding="utf-8"?>\
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
            <soap:Header>\
                <AuthenticationHeader xmlns="capgemini/crm/webservices/AreaRelacionada">\
                <TokenId>' + token + '</TokenId>\
                </AuthenticationHeader>\
            </soap:Header>\
                <soap:Body>\
                    <Insert xmlns="capgemini/crm/webservices/contacto">\
                    <input>\
                        <IsHtml>boolean</IsHtml>\
                        <IdCliente>' + req.query.customerId + '</IdCliente>\
                        <IdUtilizador>82</IdUtilizador>\
                        <IdBolsaContacto>int</IdBolsaContacto>\
                        <IdContactoOrigem>int</IdContactoOrigem>\
                        <IdTipoContacto>int</IdTipoContacto>\
                        <IdAreaRelacionada>int</IdAreaRelacionada>\
                        <IdContrato>int</IdContrato>\
                        <IdEstadoContacto>int</IdEstadoContacto>\
                        <IdEstadoAprovacao>int</IdEstadoAprovacao>\
                        <IdContactoNoCliente>int</IdContactoNoCliente>\
                        <ParaFacturar>false</ParaFacturar>\
                        <IdEstadoFacturacao>int</IdEstadoFacturacao>\
                        <Descricao>' + req.query.details + '</Descricao>\
                        <Contacto>string</Contacto>\
                        <Assunto>' + req.query.subject + '</Assunto>\
                        <NumeroFactura>string</NumeroFactura>\
                        <HoraInicio>' + req.query.starttime + '</HoraInicio>\
                        <HoraFim>' + req.query.endtime + '</HoraFim>\
                        <IdUtilizador_C>int</IdUtilizador_C>\
                        <Attachments>\
                        <base64Binary>base64Binary</base64Binary>\
                        <base64Binary>base64Binary</base64Binary>\
                        </Attachments>\
                        <AttachmentsName>\
                        <string>string</string>\
                        <string>string</string>\
                        </AttachmentsName>\
                        <FileId>int</FileId>\
                        <FileName>string</FileName>\
                    </input>\
                    </Insert>\
                </soap:Body>\
            </soap:Envelope>';

            axios.post(userUrl, userRequest, {
                headers:
                    {'Content-Type': 'text/xml'}
                }
            ).then(userResponse => {
                console.log(userResponse.data);
            }).catch(userError => {
                //console.log(userError.code);
                res.send({
                    code: userError.code,
                    status: userError.response.status,
                    data: userError.response.data
                })
            })
        });

        //console.log('\n*** ===== FULL RESPONSE === ***\n' + response.data);
    }).catch(error => {
        console.log(error);
    })
}

exports.getReferenceData = async function (req, res) {
    /*  
    === TABLE NAMES ===
        EstadoAprovacao, EstadoBolsaHoras, EstadoCliente, EstadoContacto, EstadoContrato
        EstadoFacturacao, EstadoMacroTarefa, EstadoOCP, EstadoPAT, EstadoProcesso
        EstadoRelatorioVisita, EstadoReuniao, EstadoTarefa, TipoAssistencia, TipoComissao
        TipoContacto, TipoContrato, TipoDespesa, TipoDistribuicaoOportunidade, TipoDocumento
        TipoInstalacao, TipoMensagemML, TipoPAT, TipoPlanoFaturacao, TipoRecurso, TipoServidor
        TipoTarefa, TipoTemplate, TipoViatura, Actividade, AreaNegocio, AreaPAT, AreaRelacionada
        Cargo, CodigoActividadeEconomica, FaseNoCliente, FaseOportunidade, Genero, Hobby, Idioma
        NumEmpregados, OrigemOportunidade, OrigemPAT, Pais, PeriodicidadeContrato, PeriodicidadeTarefa
        Prioridade, Probabilidade, Titulo, VolumeNegocios, Zona
    ====================
    */
    axios.post(tokenUrl, tokenRequest, { 
        headers:
             {'Content-Type': 'text/xml'}
        }
    ).then(response => {
        var xmlData = response.data;
        parser.parseString(xmlData, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return;
            }
            // Accessing data within the envelope
            var isGranted = result['soap:Envelope']['soap:Body'].LoginResponse.LoginResult.AccessGranted;
            var token = result['soap:Envelope']['soap:Body'].LoginResponse.LoginResult.Token;
            console.log('\nIs Granted: ' + isGranted);
            console.log('Token: ' + token);    
            
            var userUrl = 'http://crm.aqi.co.mz/SendysCRM/webservices/ReferenceData.asmx';
            var userRequest = '<?xml version="1.0" encoding="utf-8"?>\
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
            <soap:Header>\
                <AuthenticationHeader xmlns="capgemini/crm/webservices/referencedata">\
                <TokenId>' + token + '</TokenId>\
                </AuthenticationHeader>\
            </soap:Header>\
            <soap:Body>\
                <GetAll xmlns="capgemini/crm/webservices/referencedata">\
                    <input>\
                        <Table>' + req.query.table + '</Table>\
                    </input>\
                </GetAll>\
            </soap:Body>\
            </soap:Envelope>';

            axios.post(userUrl, userRequest, {
                headers:
                    {'Content-Type': 'text/xml'}
                }
            ).then(userResponse => {
                console.log(userResponse.data);
                var xmlResult = userResponse.data;

                parser.parseString(xmlResult, (err, result) => {
                    if (err) {
                        console.error('Error parsing XML:', err);
                        return;
                    }

                    res.send({ data: result['soap:Envelope']['soap:Body']/*.QueryByPhoneResponse.QueryByPhoneResult.ContactosNoCliente.ContactoNoCliente_Data*/});
                })

            }).catch(userError => {
                //console.log(userError.code);
                res.send({
                    code: userError.code,
                    status: userError.response.status,
                    data: userError.response.data
                })
            })
        });

        //console.log('\n*** ===== FULL RESPONSE === ***\n' + response.data);
    }).catch(error => {
        console.log(error);
    })

}