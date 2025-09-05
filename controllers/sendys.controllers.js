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

exports.insertCustomer = async function (req, res) {
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
                    <IdFirma></IdFirma>\
                    <IdNumeracaoAutomatica></IdNumeracaoAutomatica>\
                    <Nome>' + customerName + '</Nome>\
                    <SegundoNome>' + tradingName + '</SegundoNome>\
                    <Numero></Numero>\
                    <IdDistribuidor></IdDistribuidor>\
                    <Descricao></Descricao>\
                    <DescricaoPrivada></DescricaoPrivada>\
                    <InformacaoUrgente></InformacaoUrgente>\
                    <WebSite></WebSite>\
                    <IdZona></IdZona>\
                    <IdCAE></IdCAE>\
                    <IdCAE2></IdCAE2>\
                    <NIB></NIB>\
                    <NIF></NIF>\
                    <Distribuidor></Distribuidor>\
                    <IDEstadoCliente></IDEstadoCliente>\
                    <IdUtilizador_Vendedor></IdUtilizador_Vendedor>\
                    <IdActividade></IdActividade>\
                    <IdNumEmpregados></IdNumEmpregados>\
                    <IdVolumeNegocios></IdVolumeNegocios>\
                    <IdPrioridade></IdPrioridade>\
                    <DataInicio></DataInicio>\
                    <DataFim></DataFim>\
                    <DataInicioActividade></DataInicioActividade>\
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

exports.getContacts = async function (req, res) {
}

exports.getAll = async function (req, res) {
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
                <GetAll xmlns="capgemini/crm/webservices/AreaRelacionada">\
                <input />\
                </GetAll>\
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
                    <IdUtilizador>' + req.query.userId + '</IdUtilizador>\
                    <IdEstadoTarefa>' + req.query.statusId + '</IdEstadoTarefa>\
                    <IdTipoTarefa>' + req.query.taskType + '</IdTipoTarefa>\
                    <Nome>' + req.query.taskName + '</Nome>\
                    <Descricao>' + req.query.taskDescription + '</Descricao>\
                    <Inicio>' + new Date().toISOString() + '</Inicio>\
                    <Fim>' + new Date().toISOString() + '</Fim>\
                    <IncluirNaAgenda>true</IncluirNaAgenda>\
                    <IdAreaRelacionada>0</IdAreaRelacionada>\
                    <IdUtilizador_C>0</IdUtilizador_C>\
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
                <GetAll xmlns="capgemini/crm/webservices/AreaRelacionada">\
                <input />\
                </GetAll>\
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