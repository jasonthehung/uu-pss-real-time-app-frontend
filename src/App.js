import "./App.css"
import { useState, useEffect } from "react"
import io from "socket.io-client"
import { nanoid } from "nanoid"
import { set } from "mongoose"

// const socket = io(URL, { autoConnect: false })
const socket = io("http://localhost:8080")
const userName = nanoid(4)

// socket.onAny((event, ...args) => {
//     console.log(event, args)
// })

function App() {
    const [roomId, setRoomId] = useState("")
    const [submittedRoom, setSubmittedRoom] = useState("")
    const [message, setMessage] = useState("")
    const [chat, setChat] = useState([])

    const [host, setHost] = useState(false)
    const [player, setPlayer] = useState(false)
    const [joined, setJoined] = useState(false)

    const sendChat = (e) => {
        e.preventDefault()
        socket.emit("chat", { message, userName })
        setMessage("")
    }

    const createRoom = (e) => {
        e.preventDefault()
        socket.emit("createRoom", { newRoom: roomId })
        setRoomId("")
        setSubmittedRoom(roomId)
    }

    const joinRoom = (e) => {
        e.preventDefault()
        socket.emit("joinRoom", { name: userName, room: roomId })
    }

    useEffect(() => {
        socket.on("chat", (payload) => {
            setChat([...chat, payload])
            console.log(chat)
        })

        socket.on("roomError", (err) => {
            console.log(err)
        })

        socket.on("message", (msg) => {
            console.log(msg)
        })
    })

    return (
        <div className="App">
            <header className="App-header">
                <h1>Hello Quizzy</h1>
                {chat.map((payload, index) => {
                    return (
                        <p key={index}>
                            {payload.message}:{" "}
                            <span>id: {payload.userName}</span>
                        </p>
                    )
                })}

                {!player && !host && (
                    <button
                        onClick={() => {
                            setPlayer(true)
                        }}
                    >
                        Player
                    </button>
                )}

                {!player && !host && (
                    <button
                        onClick={() => {
                            setHost(true)
                        }}
                    >
                        Game Host
                    </button>
                )}

                {player && (
                    <>
                        <form onSubmit={sendChat}>
                            <input
                                type="text"
                                name="message"
                                placeholder="send message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            ></input>
                            <button type="submit">Send</button>
                        </form>
                        <form onSubmit={joinRoom}>
                            <input
                                type="text"
                                name="roomId"
                                placeholder="Enter room id..."
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                            ></input>
                            <button type="submit">Join</button>
                        </form>
                    </>
                )}

                {host && (
                    <>
                        <form onSubmit={createRoom}>
                            <input
                                type="text"
                                name="roomId"
                                placeholder="Enter room id..."
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                            ></input>
                            <button type="submit">Create</button>
                        </form>
                        {submittedRoom && (
                            <p>You created a roomId: {submittedRoom} </p>
                        )}
                    </>
                )}
            </header>
        </div>
    )
}

export default App
