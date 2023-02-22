import * as utils from '@dcl/ecs-scene-utils'
import {scene} from "./scene"

// 1) Controllo della combinazione e dell'animazione

let combinazione_premuta = ""
let combinazione_apertura = "1234"
let lock :boolean = false
let lock_conferma:boolean = false
let count = 0;

let stanza  = scene.stanza3.entity
engine.addEntity(stanza)

let animator = new Animator()
stanza.addComponent(animator)
const open = new AnimationState("close /open_DoorBone.001")
open.weight = 0.2
animator.addClip(open)

export class Controllo_Combinazione implements ISystem {
  update() {
    if(lock_conferma == true)
    {
      if(combinazione_apertura === combinazione_premuta){
        open_stop(open)
      }
    }
  }
}

let combin = new Controllo_Combinazione()
engine.addSystem(combin)

function open_stop (open:AnimationState){
  if(lock == false)
  {
    open.looping = false
    open.play()
    movimento(porta_col,2)
    lock=true
  }
}


// 2) Interattività della pulsantiera

function spawnCube(x: number, y: number, z: number) {

  const cube = new Entity()
  cube.addComponent(new Transform({ position: new Vector3(x, y, z),
  scale: new Vector3(0.1,0.1,0.2)}))

  cube.addComponent(new BoxShape())
  engine.addEntity(cube)
  return cube
}

function interactButton(obj: Entity, msg: number){
  obj.addComponent(new OnPointerDown(() => 
  {
    if(count < 4){
    combinazione_premuta = combinazione_premuta + msg
    count = count + 1
    }
  },
  {
    button: ActionButton.POINTER,
      showFeedback: true,
      hoverText: "" + msg
  }
  ))
}

function confermaButton(obj:Entity){
  obj.addComponent(new OnPointerDown(() => 
  {
    lock_conferma = true
  },
  {
    button: ActionButton.POINTER,
      showFeedback: true,
      hoverText: "Conferma"
  }
  ))
}

function resetButton(obj:Entity){
  obj.addComponent(new OnPointerDown(() => 
  {
    combinazione_premuta = ""
    lock_conferma = false
    count = 0
  }, 
  {
    button: ActionButton.POINTER,
      showFeedback: true,
      hoverText: "Cancella"
  }
  ))
}

function make_invisible(obj:Entity){
  const trasparente = new Material()
  trasparente.albedoColor = new Color4(0, 0, 0, 0)
  obj.addComponent(trasparente)
  
}


const pulsante_1 = scene.pulsante1.entity
const pulsante_2 = scene.pulsante2.entity
const pulsante_3 = scene.pulsante3.entity
const pulsante_4 = scene.pulsante4.entity
const pulsante_5 = scene.pulsante5.entity
const pulsante_6 = scene.pulsante6.entity
const pulsante_7 = scene.pulsante7.entity
const pulsante_8 = scene.pulsante8.entity
const pulsante_9 = scene.pulsante9.entity
const pulsante_Conferma = scene.pulsanteconferma.entity
const pulsante_0 = scene.pulsante0.entity
const pulsante_Reset = scene.pulsantereset.entity

interactButton(pulsante_1,1)
interactButton(pulsante_2,2)
interactButton(pulsante_3,3)
interactButton(pulsante_4,4)
interactButton(pulsante_5,5)
interactButton(pulsante_6,6)
interactButton(pulsante_7,7)
interactButton(pulsante_8,8)
interactButton(pulsante_9,9)
resetButton(pulsante_Reset)
interactButton(pulsante_0,0)
confermaButton(pulsante_Conferma)

make_invisible(pulsante_1)
make_invisible(pulsante_2)
make_invisible(pulsante_3)
make_invisible(pulsante_4)
make_invisible(pulsante_5)
make_invisible(pulsante_6)
make_invisible(pulsante_7)
make_invisible(pulsante_8)
make_invisible(pulsante_9)
make_invisible(pulsante_Conferma)
make_invisible(pulsante_0)
make_invisible(pulsante_Reset)

// 3) Display della combinazione e gestione della telecamera

export class Display_Number implements ISystem {
  update() 
  {
    panel.getComponent(TextShape).value = combinazione_premuta
  }
}

let display = new Display_Number()
engine.addSystem(display)

// Gestione del testo sul display
const panel = spawnCube(18, 2.1, 11.50)
panel.getComponent(Transform).scale = new Vector3(0.9,0.5,0.2)
panel.getComponent(Transform).rotation = new Quaternion(1, 90, 0, -90)
panel.getComponent(Transform).position = new Vector3(16.7,2.75,3.52)

let testo = new TextShape(" ");
panel.addComponent(testo);
testo.paddingBottom = 0;
testo.fontSize = 6.8;
testo.shadowBlur = 0.4;
testo.shadowColor = Color3.Blue();
testo.shadowOffsetX = -1;
testo.shadowOffsetY = 1;

make_invisible(panel)

//telecamera in prima persona
const modArea = new Entity()
modArea.addComponent(
  new CameraModeArea({
    area: { box: new Vector3(2, 2, 2) },
    cameraMode: CameraMode.FirstPerson,
  })
)
modArea.addComponent(
  new Transform({
    position: new Vector3(19, 0, 3),
  })
)
engine.addEntity(modArea)


//4) Gestione della fisicità della porta all'apertura

function movimento(obj: Entity,time: number){

  let start = new Vector3(16.7, 2, 6.2)
  let end = new Vector3(15.7, 2, 5.40)

  let start_r = Quaternion.Euler(0, 0, 0)
  let end_r =Quaternion.Euler(90, 0, 90)

  obj.addComponent(new utils.MoveTransformComponent(start, end,time))
  obj.addComponent(new utils.RotateTransformComponent(start_r, end_r, 0.7))
}


//collider per la porta 
let porta_col  = new Entity()
porta_col.addComponent(
  new Transform({
    position: new Vector3(16.7, 2, 6.2),
    scale: new Vector3(0.2,1.7,1.8)
  })
)

let box_porta = new BoxShape()

box_porta.withCollisions = true
porta_col.addComponent(box_porta)
make_invisible(porta_col)
engine.addEntity(porta_col)

