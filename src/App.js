import "./App.css"
import { useState, useEffect } from "react"
import io from "socket.io-client"
import { nanoid } from "nanoid"

const userName = nanoid(4) // random value between 0 - 4

// const socket = io(URL, { autoConnect: false })
const socket = io("http://localhost:8080")

socket.onAny((event, ...args) => {
    console.log(event, args)
})

function App() {
    const [room, setRoom] = useState("")
    const [message, setMessage] = useState("")
    const [chat, setChat] = useState([])

    const sendChat = (e) => {
        e.preventDefault()
        socket.emit("chat", { message, userName })
        setMessage("")
    }

    const sendRoom = (e) => {
        e.preventDefault()
        socket.emit("joinRoom", { name: "dummy_user", room: room })
        setRoom("")
    }

    useEffect(() => {
        socket.on("chat", (payload) => {
            setChat([...chat, payload])
        })

        socket.on("userList", (payload) => {
            console.log(payload)
        })

        socket.on("message", (payload) => {
            console.log(payload)
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

                <form onSubmit={sendChat}>
                    <input
                        type="text"
                        name="chat"
                        placeholder="send text..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></input>
                    <button type="submit">Send</button>
                </form>

                <form onSubmit={sendRoom}>
                    <input
                        type="text"
                        name="room"
                        placeholder="send room id..."
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                    ></input>
                    <button type="submit">Send</button>
                </form>
            </header>
        </div>
    )
}

export default App
