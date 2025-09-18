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

async function addContacts (customerId, customerName, email, token, phone, mobile) {    
    var response = '';       
    var userUrl = 'http://crm.aqi.co.mz/SendysCRM/webservices/Cliente.asmx';
    var userRequest = '<?xml version="1.0" encoding="utf-8"?>\
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
    <soap:Header>\
        <AuthenticationHeader xmlns="capgemini/crm/webservices/cliente">\
        <TokenId>' + token + '</TokenId>\
        </AuthenticationHeader>\
    </soap:Header>\
    <soap:Body>\
        <AdicionarContacto xmlns="capgemini/crm/webservices/cliente">\
        <contacto>\
            <Descricao>string</Descricao>\
            <Id>1</Id>\
            <Nome>' + customerName + '</Nome>\
            <IdCliente>' + customerId + '</IdCliente>\
            <IdCargo>4</IdCargo>\
            <IdTitulo>1</IdTitulo>\
            <Telefone>' + phone + '</Telefone>\
            <Telemovel>' + mobile + '</Telemovel>\
            <Email>' + email + '</Email>\
            <Titulo></Titulo>\
            <Cargo>Utilizador</Cargo>\
            <Principal>true</Principal>\
            <DataAlteracao>' + new Date().toISOString() + '</DataAlteracao>\
            <DataSync>' + new Date().toISOString() + '</DataSync>\
            <Total>1</Total>\
        </contacto>\
        <userid>82</userid>\
        </AdicionarContacto>\
    </soap:Body>\
    </soap:Envelope>';

    axios.post(userUrl, userRequest, {
        headers:
            {'Content-Type': 'text/xml'}
        }
    ).then(userResponse => {
        var xmlResult = userResponse.data;

        parser.parseString(xmlResult, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return;
            }

            response = result['soap:Envelope']['soap:Body'];
        })

        console.log('Contact Response: \n' + response['AdicionarContactoResponse']['AdicionarContactoResult']);
        return response['AdicionarContactoResponse']['AdicionarContactoResult'];
    }).catch(userError => {
        console.log('\nError: \n' + userError);
        return userError.code;
    })
}

async function addAddress(tokenString, customerNumber, fullAddress, location) {
    var response = '';    
    var userUrl = 'http://crm.aqi.co.mz/SendysCRM/webservices/Cliente.asmx';
    var userRequest = '<?xml version="1.0" encoding="utf-8"?>\
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
    <soap:Header>\
        <AuthenticationHeader xmlns="capgemini/crm/webservices/cliente">\
        <TokenId>' + tokenString + '</TokenId>\
        </AuthenticationHeader>\
    </soap:Header>\
    <soap:Body>\
        <AdicionarMorada xmlns="capgemini/crm/webservices/cliente">\
        <morada>\
            <Id>1</Id>\
            <IdCliente>' + customerNumber + '</IdCliente>\
            <Morada>' + fullAddress + '</Morada>\
            <Distancia>1</Distancia>\
            <Localidade>' + location + '</Localidade>\
            <CodigoPostal></CodigoPostal>\
            <Descricao></Descricao>\
            <Principal>true</Principal>\
        </morada>\
        <userid>82</userid>\
        </AdicionarMorada>\
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

            response = result['soap:Envelope']['soap:Body'];
        });

        console.log('Address Response: \n' + response['AdicionarMoradaResponse']['AdicionarMoradaResult']);
        return response['AdicionarMoradaResponse']['AdicionarMoradaResult'];
    }).catch(userError => {
        console.log('Second Call Error: ' + userError);
        return userError.code;
    })

}

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
                //console.log(userResponse.data);
                var xmlResult = userResponse.data;

                parser.parseString(xmlResult, (err, result) => {
                    if (err) {
                        console.error('Error parsing XML:', err);
                        return;
                    }

                    var data = result['soap:Envelope']['soap:Body']['QueryByPhoneResponse']['QueryByPhoneResult']['ContactosNoCliente']['ContactoNoCliente_Data'];
                    console.log('Call Result: ' + data + '\n' + result['soap:Envelope']['soap:Body']);

                    // Check if user exists in database
                    if (data) {   
                                          
                        const params = new URLSearchParams({
                            prefill: 'true',
                            userId: data.IdCliente,
                            name: data.NomeCliente,
                            email: data.Email,
                            phone: data.Telefone,
                            mobile: data.Telemovel
                            // ... include other fields
                        });

                        //res.redirect(`https://162.214.150.246/pages/webform.html?${params}`);
                       //res.redirect(`https://162.214.150.246/?${params}`);
                       /*
                       res.send({ data: {
                            id: data.IdCliente,
                            name: data.NomeCliente,
                            email: data.Email,
                            phone: data.Telefone,
                            mobile: data.Telemovel,
                            contactUrl:`https://162.214.150.246/?${params}`
                       }});*/
                       res.json({ data: data, contactUrl:  `http://162.214.150.246/?${params}`});
                    } else {
                       // New user - return URL for empty form
                       //res.redirect('https://162.214.150.246/pages/webform.html?prefill=false');
                       res.json({ contactUrl: 'https://162.214.150.246/?prefill=false' });
                    }
                })

            }).catch(userError => {
                console.log('\nError: \n' + userError);
                
                res.send({
                    code: userError.code,
                    status: userError.status,
                    data: userError.data
                })
            })
        });
    }).catch(error => {
        console.log(error);
    })
}

/* ==== DONE ==== */
exports.insertCustomer = async function (req, res) {
    var firstname = req.query.firstname;
    var lastname = req.query.lastname;
    var contactname = req.query.contactname;
    var email = req.query.email;
    var phone = req.query.phone;
    var mobile = req.query.mobile;
    var address = req.query.address;
    var city = req.query.city;
    
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

            var userUrl = 'http://crm.aqi.co.mz/SendysCRM/webservices/Cliente.asmx';
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
                    <Nome>' + firstname + '</Nome>\
                    <SegundoNome>' + lastname + '</SegundoNome>\
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

            axios.post(userUrl, userRequest, {
                headers:
                    {'Content-Type': 'text/xml'}
                }
            ).then(userResponse => {
                var xmlResult = userResponse.data;

                parser.parseString(xmlResult, (err, result) => {
                    if (err) {
                        console.error('Error parsing XML:', err);
                        return;
                    }

                    var customerId = result['soap:Envelope']['soap:Body']["InsertResponse"]["InsertResult"]["Id"];
                    console.log('Customer ID: ' + customerId);

                    res.send({ data: result['soap:Envelope']['soap:Body'],
                        contact: addContacts(customerId, contactname, email, token, phone, mobile),
                        address: addAddress(token , customerId, address, city)
                    });
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
    }).catch(error => {
        console.log(error);
    })
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
    console.log('Request Details: ' + req);
    var tipoChamada = (req.query.calldirection === "Inbound" ? 1 : 2);
    var callStatus = (req.query.status === "OK" ? 2 : 3);
    var description = 'Call was not recorded';

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
            
            var userUrl = 'http://crm.aqi.co.mz/SendysCRM/webservices/Contacto.asmx';
            var userRequest = '<?xml version="1.0" encoding="utf-8"?>\
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
            <soap:Header>\
                <AuthenticationHeader xmlns="capgemini/crm/webservices/contacto">\
                <TokenId>' + token + '</TokenId>\
                </AuthenticationHeader>\
            </soap:Header>\
            <soap:Body>\
                <Insert xmlns="capgemini/crm/webservices/contacto">\
                <input>\
                    <IsHtml>false</IsHtml>\
                    <IdCliente>' + req.query.customerId + '</IdCliente>\
                    <IdUtilizador>82</IdUtilizador>' +
                    //<IdBolsaContacto>1</IdBolsaContacto>\
                    '<IdContactoOrigem>' + req.query.phone + '</IdContactoOrigem>\
                    <IdTipoContacto>' + tipoChamada + '</IdTipoContacto>\
                    <IdAreaRelacionada>7</IdAreaRelacionada>' +
                    //<IdContrato>1</IdContrato>\
                    '<IdEstadoContacto>' + callStatus + '</IdEstadoContacto>\
                    <IdEstadoAprovacao>1</IdEstadoAprovacao>\
                    <IdContactoNoCliente>' + req.query.contactId + '</IdContactoNoCliente>\
                    <ParaFacturar>false</ParaFacturar>\
                    <IdEstadoFacturacao>3</IdEstadoFacturacao>\
                    <Descricao>' + description + '</Descricao>\
                    <Contacto>' + req.query.phone + '</Contacto>\
                    <Assunto>' + req.query.subject + '</Assunto>\
                    <NumeroFactura></NumeroFactura>\
                    <HoraInicio>' + new Date(req.query.starttime).toISOString() + '</HoraInicio>\
                    <HoraFim>' + new Date(req.query.endtime).toISOString()  + '</HoraFim>\
                    <IdUtilizador_C>82</IdUtilizador_C>\
                    <Attachments>\
                    <base64Binary></base64Binary>\
                    <base64Binary></base64Binary>\
                    </Attachments>\
                    <AttachmentsName>\
                    <string></string>\
                    <string></string>\
                    </AttachmentsName>\
                    <FileId>1</FileId>\
                    <FileName></FileName>\
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