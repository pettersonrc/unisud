# Unisud — protótipo navegável

Protótipo local em React, JavaScript e Tailwind CSS, baseado no vídeo fornecido. A interface está em espanhol. Especialidades, profissionais e períodos de atendimento foram transcritos das imagens IMG_1321 a IMG_1325. O agendamento continua sendo uma simulação local, sem backend ou autenticação real.

## Executar

1. Instale as dependências: `npm install`
2. Inicie: `npm run dev`
3. Abra o endereço indicado no terminal.

Distribuição: `npm run build`.
Verificação do catálogo, navegação e consultas simuladas: `node --test tests/*.test.js`.
O projeto não possui um script de lint; a formatação é verificada com Prettier.

## Fluxo

Entrada → Dashboard → Agendar consulta → Médicos disponíveis → Calendário e horário → Revisão → Confirmação.

A navegação usa o fragmento da URL. Os dados do paciente e da seleção ficam em memória; recarregar a página limpa esses dados.

## Fonte compartilhada dos atendimentos

`src/data/clinic.js` concentra as cinco especialidades, 21 profissionais, três estudos de Imágenes, horários semanais, sede, telefone e aviso de disponibilidade das imagens. As linhas repetidas de um profissional são agrupadas no mesmo cadastro, preservando cada dia e faixa.

- Cirugía general: IMG_1321 — 3 profissionais.
- Ginecología: IMG_1322 — 7 profissionais.
- Imágenes: IMG_1323 — 3 profissionais, um por estudo.
- Pediatría: IMG_1324 — 3 profissionais.
- Clínica médica: IMG_1325 — 5 profissionais.

Os dias semanais se repetem no calendário, que bloqueia datas passadas e dias incompatíveis. Não há dados sobre vagas, exceções, feriados ou duração de consultas nas imagens; o protótipo não simula essas informações. Faixas como 09:00–11:00 são selecionadas integralmente, sem criar consultas de 30 minutos. Quando só o início foi informado, o horário é preservado sem inventar término.

Ecografía General, com Dr. José Prado, informa “Al llamado, previo agendamiento”: o mesmo modal apresenta o telefone fornecido e não oferece datas ou horários fictícios. O telefone é um link para chamada; nenhuma chamada é realizada automaticamente.

Trocar especialidade, estudo ou profissional limpa a seleção dependente. A revisão valida novamente a relação entre especialidade, profissional, estudo, data e horário.

## Design

O layout original foi preservado. Os cards de profissionais usam iniciais, especialidade/estudo e os períodos publicados, sem fotos. Os retratos antigos foram removidos dos arquivos da aplicação.

O menu conecta dashboard, médicos, especialidades, consultas, histórico, exames, avisos, perfil e preferências. A confirmação cria uma consulta simulada, que pode ser reprogramada ou cancelada sem perder o registro. A seleção de horário pelo diretório solicita os dados do paciente antes da confirmação.

O aviso de demonstração permanece visível. Duas consultas de exemplo usam um paciente fictício identificado e dias compatíveis com o catálogo fornecido. Não representam reservas ou atendimentos institucionais reais. Exames possuem um estado vazio explicando a ausência de integração. Perfil, preferências e consultas ficam apenas em memória, são compartilhados entre as telas e reiniciam ao recarregar a página. Não há envio de notificações, autenticação, prontuário ou backend.

## Organização

- `src/components`: elementos compartilhados e estrutura do portal.
- `src/pages`: entrada, dashboard e fluxo de agendamento.
- `src/data/clinic.js`: catálogo e regras compartilhadas de atendimento.
- `src/styles.css`: tema, componentes e ajustes responsivos com Tailwind.
- `tests/clinic.test.js`: verificações de calendário, faixas e combinações incompatíveis.
