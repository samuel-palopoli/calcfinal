document.addEventListener("DOMContentLoaded", function () {
    
    fetchUnidadesConsumidoras();
    fetchBandeiras();
});

function fetchUnidadesConsumidoras() {
    fetch('http://localhost:8000/unidades-consumidoras')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const unidadeSelect = document.getElementById('unidadeConsumidoraSelect');
            unidadeSelect.innerHTML = '<option value="">Selecione uma unidade consumidora</option>';
            data.unidades.forEach(unidade => {
                unidadeSelect.innerHTML += `<option value="${unidade.id}">${unidade.nome}</option>`;
            });
        })
        .catch(error => console.error('Erro ao buscar unidades consumidoras:', error));
}

function fetchBandeiras() {
    fetch('http://localhost:8000/bandeiras')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const bandeiraSelect = document.getElementById('bandeiraSelect');
            bandeiraSelect.innerHTML = '<option value="">Selecione uma bandeira tarifária</option>';
            data.bandeiras.forEach(bandeira => {
                bandeiraSelect.innerHTML += `<option value="${bandeira.tarifa}">${bandeira.nome} - R$ ${bandeira.tarifa.toFixed(2)}</option>`;
            });
        })
        .catch(error => console.error('Erro ao buscar bandeiras:', error));
}

function calcularConsumo() {
    const unidadeId = document.getElementById('unidadeConsumidoraSelect').value;
    const bandeiraTarifa = parseFloat(document.getElementById('bandeiraSelect').value);

    if (!unidadeId || isNaN(bandeiraTarifa)) {
        alert("Selecione uma unidade consumidora e uma bandeira tarifária.");
        return;
    }

    fetch(`http://localhost:8000/unidades-consumidoras/${unidadeId}/dispositivos`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let consumoTotal = 0;

            data.dispositivos.forEach(dispositivo => {
                consumoTotal += dispositivo.consumo_diario * dispositivo.quantidade;
            });

            const consumoAnual = consumoTotal * 365;
            const custoTotal = consumoAnual * bandeiraTarifa; 

            document.getElementById('resultado').innerText = `Consumo Anual: ${consumoAnual.toFixed(2)} kWh - Custo: R$ ${custoTotal.toFixed(2)}`;
        })
        .catch(error => console.error('Erro ao calcular o consumo:', error));
}
