# Fluxo da aplicação

## 1 - Usuário acessa a pagina asked.com
- Nada acontece no backend. frontend é uma aplicação separada.

## 2 - Usuário digita o nome e clica em Create Room
- Nada acontece no backend ainda. O nome vai para a URL como query param e o router redireciona para /game?playerName=João.

## 3 — Página Game carrega
- Frontend conecta o socket → backend dispara o evento connection, cria os listeners para aquele socket
- Frontend emite create_room
-Backend cria um Room com o socket.id como dono, salva no RoomRepository, entra na sala do socket.io, emite room_id de volta
- Frontend recebe room_id, salva no estado newRoomId, exibe na tela
- Frontend emite send_player com o nome
- Backend cria o objeto player com { name, socketId }, adiciona na lista players, busca a sala pelo socketId, emite display_players para todos na sala
- Frontend recebe display_players, atualiza a lista na tela