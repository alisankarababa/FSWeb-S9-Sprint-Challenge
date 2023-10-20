import React, { useState } from 'react'
import axios from 'axios';

// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  
    const [idxB, setIdxB] = useState(initialIndex);
    const [cntMove, setCntMove] = useState(initialSteps);
    const [email, setEmail] = useState(initialEmail);
    const [message, setMessage] = useState(initialMessage);
  
    // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.

  function getXY(idx) {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.

    const x = idx % 3 + 1;

    const y = Math.floor(idx / 3) + 1;
    return [x, y];
  }

  function getXYMesaj(coordinates) {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.

    return `Koordinatlar (${coordinates[0]}, ${coordinates[1]})`;
  }

  function reset() {
    // Tüm stateleri başlangıç ​değerlerine sıfırlamak için bu helperı kullanın.
    
    setIdxB(initialIndex);
    setCntMove(initialSteps);
    setEmail(initialEmail);
    setMessage(initialMessage);

  }

  function move(direction) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    const [x, y] = getXY(idxB);
    let didMove = false;


    switch (direction) {
        case "left":
            if(1 !== x) {
                setIdxB(idx => idx - 1);
                didMove = true;
            } else {
                setMessage("Sola gidemezsiniz");
            }

            break;
        case "right": 
            if(3 !== x) {
                setIdxB(idx => idx + 1);
                didMove = true;
            } else {
                setMessage("Sağa gidemezsiniz");
            }
            break;
        case "up": 
            if(1 !== y) {
                setIdxB(idx => idx - 3);
                didMove = true;
            } else {
                setMessage("Yukarıya gidemezsiniz");
            }

            break;
        case "down": 
            if(3 !== y) {
                setIdxB(idx => idx + 3);
                didMove = true;
            } else {
                setMessage("Aşağıya gidemezsiniz");
            }

        break;
    }

    if(didMove)
        setCntMove(cnt => cnt + 1);
  }


  function onChange(event) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz

    setEmail(event.target.value);
  }

  function onSubmit(event) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.

    event.preventDefault();
    const [x, y] = getXY(idxB);
    
    const data = {};

    data.x = x;
    data.y = y;
    data.steps = cntMove;
    data.email = email;


    setEmail("");

    axios.post('http://localhost:9000/api/result', data)
      .then(function (response) {
        setMessage(response.data.message);
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      });

  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj(getXY(idxB))}</h3>
        <h3 id="steps">{cntMove} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === idxB ? ' active' : ''}`}>
              {idx === idxB ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button  onClick={() => move("left")} id="left">SOL</button>
        <button  onClick={() => move("up")} id="up">YUKARI</button>
        <button  onClick={() => move("right")} id="right">SAĞ</button>
        <button  onClick={() => move("down")} id="down">AŞAĞI</button>
        <button  onClick={() => reset()} id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input 
            id="email"
            type="email"
            placeholder="email girin"
            onChange={onChange}
            value={email}
        />
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
