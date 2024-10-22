import { MaybeRefOrGetter, reactive, ref, toValue } from "vue"
import { state, socket } from "../config/socket";
import { IOccupant, ISeat } from "../types";

export function useRoom() {

    // TODO rename to roomId
    const rId = ref<string>()

    const active = ref(false)

    const clients = reactive(new Map<string, IOccupant>())

    function generateSeatsId(rows: number, cols: number): string[] {
        return Array.from({ length: rows * cols }, (_, index) => {
            const row = String.fromCharCode(65 + Math.floor(index / cols)); // "A", "B", "C", etc.
            const col = (index % cols) + 1; // "1", "2", "3", etc.
            return `${row}${col}`;
        });
    }
    
    const seats = reactive<ISeat[]>(generateSeatsId(9, 6).map(id => ({ id: id })))

    function findEmptySeat() {
        return seats.find(seat => !seat.occupant)
    }

    function findSeatOfUser(id: string) {
        console.log('findSeatOfUser', seats)
        console.log('occupants', clients)
        return seats.find(seat => seat.occupant?.id == id)
    }

    /**
     * configura socket para acessar a sala com id especificado.
     * 
     * 
     * se o id não for especificado, cria um novo id único
     * @param id 
     * @returns 
     */
    async function setRoomId(roomId?: MaybeRefOrGetter<string>) {
        const id = toValue(roomId)

        if(id) {
            rId.value = id

            return
        }

        try {
            const response = await getRandomId()
            console.log('ROOM ID NOT DEFINED, CREATING RANDOM MEETING ID')
            
            rId.value = response.roomId
            console.log('ROOM MEETING ID', rId.value)

        } catch (error) {
            console.error(error);
        }
    }

    async function getRandomId() {
        return socket.emitWithAck('create-meeting')
    }

    async function joinRoom(user: MaybeRefOrGetter<IOccupant>) {
        const u = toValue(user)
        console.log(u)
        console.log('[useRoom] join-meeting', rId.value, u.socketId)
        try {
            const response: IOccupant[] = await socket.emitWithAck("join-meeting", rId.value, u);

            response.forEach(user => {
                clients.set(user.id, user)
                const emptySeat = findEmptySeat()
                if(emptySeat) {
                    emptySeat.occupant = user
                    console.log('encontrei uma cadeira vazia ', emptySeat)
                } else {
                    console.error('Parece que não tem cadeira para o usuário...')
                }
            });
        } catch(e) {
            console.error(e)
        }
    }

    function leaveRoom(userId: MaybeRefOrGetter<string>) {
        const uId = toValue(userId)
        console.log('[useRoom] leave-meeting', rId.value, uId)
        socket.emit("leave-meeting", rId.value, uId);
        // const user = clients.get(uId )
        // if(user) {
        //     const seat = findSeatOfUser(user.socketId)
        //     if(seat) {
        //         seat.occupant = undefined
        //     }
        //     clients.delete(uId)
        // }
    }

    return {
        rId,
        active,
        clients,
        seats,
        joinRoom,
        leaveRoom,
        setRoomId,
        findEmptySeat,
        findSeatOfUser,
        // deprecated
        state, socket,
    }
}