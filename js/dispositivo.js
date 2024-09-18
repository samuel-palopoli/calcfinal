document.addEventListener("DOMContentLoaded", function () {
    fetchUnidadesConsumidoras(); 

    document.getElementById('dispositivoFormElement').addEventListener('submit', function (event) {
        event.preventDefault(); 
        saveDispositivo();
    });

    document.getElementById('unidadeConsumidoraSelect').addEventListener('change', fetchDependenciasPorUnidadeConsumidora);
});

function fetchUnidadesConsumidoras() {
    fetch('http://localhost:8000/unidades-consumidoras') 
        .then(response => response.json())
        .then(data => {
            console.log('Dados de unidades consumidoras:', data); 
            const unidadeConsumidoraSelect = document.getElementById('unidadeConsumidoraSelect');
            unidadeConsumidoraSelect.innerHTML = '<option value="">Selecione uma unidade consumidora</option>';
            if (Array.isArray(data.unidadesConsumidoras)) {
                data.unidadesConsumidoras.forEach(unidade => {
                    unidadeConsumidoraSelect.innerHTML += `<option value="${unidade.id}">${unidade.nome}</option>`;
                });
            } else {
                console.error('Dados de unidades consumidoras não são um array ou estão indefinidos.');
            }
        })
        .catch(error => console.error('Erro ao buscar unidades consumidoras:', error));
}

function fetchDependenciasPorUnidadeConsumidora() {
    const unidadeConsumidoraId = document.getElementById('unidadeConsumidoraSelect').value;

    if (!unidadeConsumidoraId) {
        document.getElementById('dispositivosList').innerHTML = '';
        return; 
    }

    fetch(`http://localhost:8000/dependencias?unidadeConsumidoraId=${unidadeConsumidoraId}`) 
        .then(response => response.json())
        .then(data => {
            console.log('Dados de dependências:', data);
            if (Array.isArray(data.dependencias) && data.dependencias.length > 0) {
                fetchDispositivosPorDependencia(data.dependencias);
            } else {
                document.getElementById('dispositivosList').innerHTML = '<p>Nenhuma dependência encontrada.</p>';
            }
        })
        .catch(error => console.error('Erro ao buscar dependências:', error));
}

function fetchDispositivosPorDependencia(dependencias) {
    const dependenciasIds = dependencias.map(dep => dep.id).join(',');

    fetch(`http://localhost:8000/dispositivos?dependencias=${dependenciasIds}`)
        .then(response => response.json())
        .then(data => {
            console.log('Dados de dispositivos:', data); 
            const list = document.getElementById('dispositivosList');
            if (Array.isArray(data.dispositivos) && data.dispositivos.length > 0) {
                list.innerHTML = '<ul class="list-group border border-danger">';
                data.dispositivos.forEach(dispositivo => {
                    list.innerHTML += `
                        <li class="list-group-item m-2 p-2 border-bottom">
                            <div class="row d-flex justify-content-between">
                                <div class="col"><strong>${dispositivo.nome}</strong></div>
                                <div class="col"> 
                                    <button class="btn btn-info btn-sm float-end ms-2" 
                                        onclick="showEditDispositivoForm(${dispositivo.id}, '${dispositivo.nome}')">Editar</button>
                                </div>
                                <div class="col"> 
                                    <button class="btn btn-danger btn-sm float-end" 
                                        onclick="deleteDispositivo(${dispositivo.id})">Deletar</button>
                                </div>
                            </div>
                        </li>`;
                });
                list.innerHTML += '</ul>';
            } else {
                list.innerHTML = '<p>Nenhum dispositivo encontrado.</p>';
            }
        })
        .catch(error => console.error('Erro ao buscar dispositivos:', error));
}
