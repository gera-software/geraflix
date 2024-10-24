<template>
    <div v-if="meOccupant" class="room-layout" :class="{ 'is-stage-fullscreen':  isStageFullscreen }">
        <div class="room-container">
            <div class="room-seats">
                <div class="scroll-area">
                    <StreamPreview 
                    v-for="item in visibleRemoteStreams" 
                    :key="item.id"
                    :remoteStream="(item as RemoteStream)"
                    :mediaStream="(item.mediaChannel?.remoteStream as MediaStream)"
                ></StreamPreview>
                    <div class="seats-grid">
                        <Seat v-for="seat of seats" :key="seat.id" :seat="seat"></Seat>
                    </div>
                    sound level: {{ soundLevel }}
                    <video ref="camVideo" autoplay muted style="max-width: 300px"></video>
                    cam enabled: {{ camIsEnabled }} / 
                    mic enabled:  {{ micIsEnabled }} / 

                    <video ref="sharedScreenVideo" autoplay muted style="max-width: 300px"></video>
                </div>
            </div>
            <div ref="elStage" class="room-stage">
                <div class="stage-screen">
                    <div class="fuzzy-overlay"></div>
                    <div class="vignette"></div>
                </div>
                <div class="buttons-bar">
                    <VolumeButtonSlider variant="secondary" v-model="streamVolume" />
                   
                    <BaseButtonIcon :title="isStageFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'" variant="secondary" @click="toggleFullScreen">
                        <IconCompress v-if="isStageFullscreen" />
                        <IconExpand v-else />
                    </BaseButtonIcon>
                </div>
            </div>
        </div>
        <div class="room-bottom-bar">
            {{ size }} users
            <AvatarOccupant v-if="meOccupant" :occupant="meOccupant">
                <template v-slot:badges>
                    <BadgeConnectionStatus :connection-status="!!meOccupant.connectionStatus" />
                </template>
            </AvatarOccupant>

            <BaseButtonIcon :title="meOccupant.micStatus ? 'mic on' : 'mic off'" :variant="meOccupant.micStatus ? 'status-on' : 'status-off'" @click="toggleMyMic">
                <IconMicrophone v-if="meOccupant.micStatus"/>
                <IconMicrophoneSlash v-else/>
            </BaseButtonIcon>
            <BaseButtonIcon :title="meOccupant.camStatus ? 'cam on' : 'cam off'" :variant="meOccupant.camStatus ? 'status-on' : 'status-off'" @click="toggleMyCam">
                <IconVideo v-if="meOccupant.camStatus"/>
                <IconVideoSlash v-else/>
            </BaseButtonIcon>
            <!-- <BaseButtonIcon title="cam off (soon)" :disabled="true">
                <IconVideoSlash/>
            </BaseButtonIcon> -->
            <BaseButtonIcon v-if="isHost(meOccupant)" :title="meOccupant.screenShareStatus ? 'film on' : 'film off'" :variant="meOccupant.screenShareStatus ? 'status-on' : 'status-off'" @click="toggleMySharedScreen">
                <IconFilm v-if="meOccupant.screenShareStatus" />
                <IconFilmSlash v-else />
            </BaseButtonIcon>
            <BaseButtonIcon title="sair da sala" variant="danger" @click="handleLeaveRoom">
                <IconDoorOpen />
            </BaseButtonIcon>
        </div>
        
        <ToastContainer class="bottom-toast-container" />
    </div>
    <div v-else>loading...
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRefs, watchEffect } from 'vue';
import { v4 as uuidV4 } from 'uuid'
import ToastContainer from '../components/ToastContainer.vue';

import BaseButtonIcon from '../components/BaseButtonIcon.vue';
import IconMicrophoneSlash from '../components/icons/IconMicrophoneSlash.vue';
import IconVideoSlash from '../components/icons/IconVideoSlash.vue';
import IconFilm from '../components/icons/IconFilm.vue';
import IconDoorOpen from '../components/icons/IconDoorOpen.vue';
import IconExpand from '../components/icons/IconExpand.vue';
import Seat from '../components/Seat.vue';
import { isHost, type IOccupant, type IUser } from '../types';
import AvatarOccupant from '../components/AvatarOccupant.vue';
import BadgeConnectionStatus from '../components/BadgeConnectionStatus.vue';
import IconCompress from '../components/icons/IconCompress.vue';

import { useDisplayMedia, useFullscreen } from '@vueuse/core'
import VolumeButtonSlider from '../components/VolumeButtonSlider.vue';
import IconMicrophone from '../components/icons/IconMicrophone.vue';
import IconFilmSlash from '../components/icons/IconFilmSlash.vue';
import StreamPreview from '../components/StreamPreview.vue';

import { useToasts } from '../composables/useToasts';

import { useRoute } from 'vue-router';
import { useRoomStore } from '../stores/useRoomStore';
import { generateRandomUser } from '../helpers/randomUser';
import { useStorage } from '@vueuse/core'
import { useLocalStream } from '../composables/useLocalStream';
import IconVideo from '../components/icons/IconVideo.vue';
import { usePeer } from '../composables/usePeer';
import { RemoteStream } from "../helpers/temporaryTypes";


const { addToast } = useToasts()

const route = useRoute();

const { room } = useRoomStore()
const { rId: roomId, clients, seats, state, socket } = toRefs(room)

const defaultMe: IUser = {
    id: uuidV4(),
    ...generateRandomUser(),
}

const meUser = useStorage('geraflix:auth-user', defaultMe, localStorage, { mergeDefaults: true })



const connected = computed(() => state.value.connected);
const size = computed(() => clients.value.size);

const streamVolume = ref(0.4)


const elStage = ref<HTMLElement | null>(null)

const { isFullscreen: isStageFullscreen, toggle: toggleFullScreen } = useFullscreen(elStage)



const meOccupant = computed<IOccupant | undefined>(() => {
    return room.clients.get(meUser.value.id)
})

watchEffect(() => {
    if(meOccupant.value) {
        meOccupant.value.roomId = roomId.value ?? ''
        meOccupant.value.socketId = socket.value.id ?? 'puts grila'
        meOccupant.value.connectionStatus = connected.value
        addToast({ message: `Conexão ${connected.value ? 'online' : 'offline'}`})
        console.log(meOccupant.value)
    }
})

watchEffect(() => {
    if(meOccupant.value) {
        meOccupant.value.micStatus = micIsEnabled.value
    }
})

watchEffect(() => {
    if(meOccupant.value) {
        meOccupant.value.camStatus = camIsEnabled.value
    }
})

watchEffect(() => {
    if(meOccupant.value && isHost(meOccupant.value)) {
        meOccupant.value.screenShareStatus = screenIsSharing.value
    }
})




function toggleMyMic() {
    muteMic()
}

function toggleMyCam() {
    muteCam()
}

async function toggleMySharedScreen() {

    // ativar compartilhamento
    if(!screenIsSharing.value) {
        await startScreenSharing()
        if(shareScreenStream.value) {
            // FIX deve dar um jeito de esperar o usuario iniciar o compartilhamento no navegador antes de connectar com os outros usuarios, senão a mediaconnection estará vazia
            // setTimeout(() => {
            //     // TODO deve ter um jeito mais facil de pegar a lista de peerIds e excluir o meu peerIdLocal, usando o usePeer composable
                for (const client of clients.value.values()) {
                    if(client.peerId != peerId.value) {// o clinente não sou eu mesmo
                        console.log('connectToShareScreenWithUser: ', client.peerId, client.peerId == peerId.value ? 'EU' : 'REMOTO');
                        connectToShareScreenWithUser(client.peerId, shareScreenStream.value)
                    }
                }
            // }, 10000)
        }
    } else { 
        // desativar compartilhamento
        // console.log('DESATIVAR COMPARTILHAMENTO DE TELA')
        stopScreenSharing()
    }
}

onMounted(() => {
    room.init(meUser.value.id, ''+route.params.roomId)
    room.active = true

    console.log('onMounted', 'auth-user', meUser.value)
})


room.socket.on("user-connected", (user) => {
    console.log(`[socket] user ${user.socketId} joined the room:`, user);
    clients.value.set(user.id, user)
    const emptySeat = room.findEmptySeat()
    if(emptySeat) {
        emptySeat.occupant = user
        console.log('encontrei uma cadeira vazia ', emptySeat)
    } else {
        console.error('Parece que não tem cadeira para o usuário...')
    }
    addToast({ message: `${user.name} entrou na reunião`})
    if(camStream.value) {
        connectToNewUser(user.peerId, camStream.value);
    }
    if(screenIsSharing.value && shareScreenStream.value) {
        connectToShareScreenWithUser(user.peerId, shareScreenStream.value)
    }
});

room.socket.on("user-disconnected", (userId) => {
    console.log(`[socket] user ${userId} leaved the room`);
     
    const seat = room.findSeatOfUser(userId)
    const name = (seat?.occupant?.name)
    
    if(seat) {
        seat.occupant = undefined
    }
    clients.value.delete(userId)
    addToast({ message: `${name} saiu da reunião`})
    removeAllRemoteStreamsByUser(userId)
    _closeAllConnectionsFromUser(userId)
});

// TODO ao desligar a chamada é preciso garantir que todas as conexões são fechadas, inclusive a de compartilhamento de tela, se houver
function handleLeaveRoom() {
    removeAllRemoteStreamsByUser(meUser.value.id)
    _closeAllConnectionsFromUser(meUser.value.id)
    // TODO should destroy peer?
    // destroy() 
    
    // TODO shoud reset room data when leaving
    room.leaveRoom(meUser.value.id)
    room.active = false
    addToast({ message: `${meUser.value.name} saiu da reunião`})
}



const camVideo = ref<HTMLVideoElement>();

const { 
    stream: camStream, 
    camIsEnabled, 
    micIsEnabled, 
    muteCam, 
    muteMic,
    soundLevel,
} = useLocalStream(camVideo)



const sharedScreenVideo = ref<HTMLVideoElement>();

const { stream: shareScreenStream, stop: stopScreenSharing, start: startScreenSharing,  enabled: screenIsSharing } = useDisplayMedia({ 
    video: true, 
    // high quality audio https://stackoverflow.com/questions/46063374/is-it-really-possible-for-webrtc-to-stream-high-quality-audio-without-noise
    audio: {
        autoGainControl: false,
        channelCount: 2,
        echoCancellation: false,
        // @ts-ignore latency does not exists?
        latency: 0,
        noiseSuppression: false,
        sampleRate: 48000,
        sampleSize: 16,
        volume: 1.0
    } 
})

watchEffect(() => {
  // preview on a video element
  if(sharedScreenVideo.value && shareScreenStream.value) {
      sharedScreenVideo.value.srcObject = shareScreenStream.value
  }
  if(shareScreenStream.value) {
    // nunca é disparado pois o stream já comeca ativado
    //   shareScreenStream.value.addEventListener('active', (e) => {
    //     console.log('shared screen active')
    //   })
    
    // garante que o evento de desligar o compartilhamento de tela vai ser disparado, mesmo se o usuário fechar a aba/janela/tela que estava sendo compartilhada
    shareScreenStream.value.addEventListener('inactive', (e) => {
        console.log('shared screen inactive', e)
        stop()
        console.log('ENVIAR COMANDO DE ENCERRAR COMPARTILHAMENTO DE TELA')
        disconnectSharedScreenWithAllUsers()
    })
  }

})



//p2p
const { peerId, open, call, connect, peer, _addMediaConnection, _addDataConnection, _closeAllConnectionsFromUser } = usePeer();

open()

const remoteStreams = ref<RemoteStream[]>([])

const visibleRemoteStreams = computed(() => {
    return remoteStreams.value.filter(s => s.visible)
})

function addToRemoteStreams(stream: RemoteStream) {
    const foundStream = remoteStreams.value.find(s => s.id == stream.id)
    // patch update 
    if(foundStream) { 
        if(stream.dataChannel) {
            foundStream.dataChannel = stream.dataChannel
        }
        if(stream.mediaChannel) {
            foundStream.mediaChannel = stream.mediaChannel
        }
    } else {
        remoteStreams.value.push(stream)
    }
}

function removeFromRemoteStreams(remoteStream: RemoteStream) {
    const index = remoteStreams.value.indexOf(remoteStream);
    remoteStreams.value.splice(index, 1);
}

function removeAllRemoteStreamsByUser(userId: string) {
    const streamsToRemove = remoteStreams.value.filter(s => s.user?.id == userId)
    for(const remoteStream of streamsToRemove) {
        removeFromRemoteStreams(remoteStream as RemoteStream)
    }
}

function getRemoteStream(remoteStreamId: string) {
    return remoteStreams.value.find(s => s.id == remoteStreamId)
}

function sendDataToRemoteStream(remoteStreamId: string, payload: any) {
    const remoteStream = getRemoteStream(remoteStreamId)
    if(remoteStream?.dataChannel) {
        remoteStream.dataChannel.send(payload)
    }
}

function sendToAllRemoteStreams(payload: any, streamType: string) {
    console.log(`BROADCAST DATA TO ALL ${streamType} streams`, payload)
    for(const remoteStream of remoteStreams.value) {
        if(remoteStream.type == streamType) {
            if(remoteStream.dataChannel) {
                remoteStream.dataChannel.send(payload)
            }
        }
    }
}

if(peer.value) {
    // when my peer object is created, join the socket room
    peer.value.on("open", (peerId) => {
        if(meUser.value) {
            room.joinRoom(
                meUser,
                peerId
            )
        }
    })

    // se algum peer me liga, o evento call é acionado
    peer.value.on("call", (mediaConnection) => {
        _addMediaConnection(mediaConnection)

        let visible = false

        if(mediaConnection.metadata.remoteStreamType === 'cam') {
            mediaConnection.answer(camStream.value);
            visible = true
        } else if(mediaConnection.metadata.remoteStreamType === 'screen-share') {
            mediaConnection.answer();
            visible = true
        }

        // add remote stream to array of remote streams
        const remoteStream: RemoteStream = {
            id: mediaConnection.metadata.remoteStreamId,
            peerId: mediaConnection.peer,
            mediaChannel: mediaConnection,
            dataChannel: null,
            type: mediaConnection.metadata.remoteStreamType,
            visible,
        }
        addToRemoteStreams(remoteStream)
    })

    // se algum peer me manda dados
    peer.value.on("connection", (dataConnection) => {
        _addDataConnection(dataConnection)
        let visible = false
        dataConnection.on('open', () => {
            // receive messages
            dataConnection.on('data', (event) => handleStreamControllerEvents(<StreamEvent>event, dataConnection.metadata.remoteStreamId))


            if(dataConnection.metadata.remoteStreamType === 'cam') {
                // send messages
                const payload = { event: 'updated-user-info', data: { user: meUser.value } }
                console.log('sendind UPDATE-USER-INFO data', payload)
                sendDataToRemoteStream(dataConnection.metadata.remoteStreamId, payload)
                visible = true
            } else if(dataConnection.metadata.remoteStreamType === 'screen-share') {
                visible = false
            }
        })

        // add remote stream to array of remote streams
        const remoteStream: RemoteStream = {
            id: dataConnection.metadata.remoteStreamId,
            peerId: dataConnection.peer,
            mediaChannel: null,
            dataChannel: dataConnection,
            type: dataConnection.metadata.remoteStreamType,
            visible,
        }
        addToRemoteStreams(remoteStream)
    })
}

function updateUserInfo(data: any, remoteStreamId: string) {
    const remoteStream = remoteStreams.value.find(remoteStream => remoteStream.id == remoteStreamId)
    if(remoteStream) {
        remoteStream.user = data.user
        // remoteStream.raisedHand = data.raisedHand
        console.log('UPDATED USER INFO', data, remoteStreamId, remoteStream)
    }
}

function sharedScreenStopped(data: any, remoteStreamId: string) {
    const remoteStream = remoteStreams.value.find(remoteStream => remoteStream.id == remoteStreamId)
    if(remoteStream) {
        console.log('SHARED SCREEN STOPPED, removing remote stream', remoteStreamId, remoteStream, data)
        removeFromRemoteStreams(remoteStream as RemoteStream)
    }
}

type StreamEvent = {
    event: string,
    data: any
}

function handleStreamControllerEvents(event: StreamEvent, remoteStreamId: string) {
    console.log(`[stream-controller] media stream ${remoteStreamId} received event:`, event)
    switch(event.event) {
        case 'updated-user-info':
            updateUserInfo(event.data, remoteStreamId)
            break
        // case 'hand-up':
        //     handUp(event.data, remoteStreamId)
        //     break
        // case 'hand-down':
        //     handDown(event.data, remoteStreamId)
        //     break
        case 'shared-screen-stopped':
            sharedScreenStopped(event.data, remoteStreamId)
            break
    }
}

function connectToNewUser(destUserPeerId: string, localCamStream: MediaStream) {

    const remoteStreamId = uuidV4()

    const metadata = {
        remoteStreamId,
        remoteStreamType: 'cam',
    }

    const options = {
        metadata
    }

    // call destination peer
    const mediaConnection = call(destUserPeerId, localCamStream, options);
    console.log('EU TO LIGANDO PRA COMPARTILHAR A CAMERA?', mediaConnection)


    // data controller connection
    const streamControllerConnection = connect(destUserPeerId, { metadata })
    if(streamControllerConnection && mediaConnection){
        streamControllerConnection.on('open', () => {
            // receive messages
            streamControllerConnection.on('data', (event) => handleStreamControllerEvents(<StreamEvent>event, remoteStreamId))

            // send messages
            const payload: StreamEvent = { event: 'updated-user-info', data: { user: meUser.value } }
            console.log('sendind UPDATE-USER-INFO data', payload)
            sendDataToRemoteStream(remoteStreamId, payload)
        })



        // add remote stream to array of remote streams
        const remoteStream: RemoteStream = {
            id: remoteStreamId,
            peerId: destUserPeerId,
            mediaChannel: mediaConnection,
            dataChannel: streamControllerConnection,
            type: 'cam',
            visible: true,
        }
        addToRemoteStreams(remoteStream)
    }

}


function connectToShareScreenWithUser(destUserPeerId: string, localSharedScreemStream: MediaStream) {
    const remoteStreamId = uuidV4()

    const metadata = {
        remoteStreamId,
        remoteStreamType: 'screen-share',
    }

    const options = {
            metadata,
            'constraints': {
                'mandatory': {
                    'OfferToReceiveAudio': true,
                    'OfferToReceiveVideo': true
                },
                offerToReceiveAudio: 1,
                offerToReceiveVideo: 1,
             },
             // better audio quality https://stackoverflow.com/questions/74926110/peerjs-how-to-use-sdp-to-improve-audio-quality
             'sdpTransform': (sdpString: string) => {
                 return sdpString.replace("a=fmtp:111 minptime=10;useinbandfec=1","a=fmtp:111 ptime=5;useinbandfec=1;stereo=1;maxplaybackrate=48000;maxaveragebitrat=128000;sprop-stereo=1");
             }
        }

    // call destination peer
    const mediaConnection = call(destUserPeerId, localSharedScreemStream, options);
    console.log('EU TO LIGANDO PRA COMPARTILHAR A TELA?', mediaConnection?.remoteStream)

    // data controller connection
    const streamControllerConnection = connect(destUserPeerId, { metadata })
    if(streamControllerConnection && mediaConnection){
        streamControllerConnection.on('open', () => {
            // receive messages
            streamControllerConnection.on('data', (event) => handleStreamControllerEvents(<StreamEvent>event, remoteStreamId))
    
            // send messages
            const payload: StreamEvent = { event: 'updated-user-info', data: { user: meUser.value } }
            sendDataToRemoteStream(remoteStreamId, payload)
        })




        // add remote stream to array of remote streams, mas com a visibilidade desativada
        const remoteStream: RemoteStream = {
            id: remoteStreamId,
            peerId: destUserPeerId,
            mediaChannel: mediaConnection,
            dataChannel: streamControllerConnection,
            type: 'screen-share',
            visible: false,
        }
        addToRemoteStreams(remoteStream)
    }
}


function disconnectSharedScreenWithAllUsers() {
    
    const payload: StreamEvent = { event: 'shared-screen-stopped', data: { } }
    sendToAllRemoteStreams(payload, 'screen-share') // TODO deveria esperar todas as conexões receberem o payload antes de serem removidas do array de remoteStreams?

    // remove all remote streams of type screen-share invisible
    for(const remoteStream of remoteStreams.value) {
        if(remoteStream.type == 'screen-share') {
            console.log('PARA REMOVER?', remoteStream)
            removeFromRemoteStreams(remoteStream as RemoteStream)
        }
    }
    // TODO remover all peer connections related to all removed remote streams

}

</script>

<style scoped>
.room-layout {
    display: grid;
    grid-template-rows: 1fr 62px;
    height: 100vh;
    background-color: #303030;
}

.room-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    overflow: hidden;
}

.room-bottom-bar {
    background-color: rgba(0, 0, 0, 0.5);
    height: 62px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    color: white;
}

.room-stage {
    position: relative;
    display: grid;
    place-items: center;
}

.room-seats {
    position: relative;
    overflow: hidden;
}

.seats-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    padding: 60px 15px;
    max-width: 385px;
    margin: auto;
    /* height: 100%; */
}

.scroll-area {
    overflow-y: auto;
    height: 100%;
    max-height: 100%;
    
    display: grid;
    place-items: center
}

.stage-screen {
    background-color: rgb(0, 0, 0);
    width: 90%;
    height: 90%;
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    background-color: black;
    background-image: url('../assets/standby.png');
    background-size: contain;
    background-position: center;
    box-shadow: -11px 7px 21px -10px rgba(0,0,0,0.98);

    transform: rotateY(-2deg); 
    transition: 
        transform .3s ease-in .3s, 
        width .3s ease-in 0s, 
        height .3s ease-in 0s,
        border-radius .1s linear;
}

.stage-screen .fuzzy-overlay {
    position: absolute;
    inset: -200%;
    opacity: 25%;
    background-image: url('../assets/noise.png');
    animation: fuzzy-overlay .2s linear infinite both;
    pointer-events: none;
}

@keyframes fuzzy-overlay {
    0% {
        transform: translateX(0%) translateY(0%);
    }
    100% {
        transform: translateX(-10%) translateY(-10%);
    }
}

.stage-screen .vignette {
    position: absolute;
    inset: 0;
    box-shadow: 0 0 200px rgba(0,0,0,0.9) inset;
    pointer-events: none;
}


.room-stage {
    perspective: 90px;
    perspective-origin: center left;
}

.is-stage-fullscreen .stage-screen {
    border-radius: 0px;
    transform: rotateY(0);
    width: 100%;
    height: 100%;

    transition: 
        transform .3s ease-in 0s, 
        width .3s ease-in .3s, 
        height .3s ease-in .3s,
        border-radius 0s linear .6s;
}

.room-stage .buttons-bar {
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    gap: 15px;
    padding: 15px;
}

.bottom-toast-container {
    position: absolute;
    bottom: 62px;
    left: 0;
    width: 100%;
}
</style>
