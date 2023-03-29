import React, { useEffect, useState, useRef } from 'react'
import "aframe"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { songsdata } from './audios';
import model from './models/jukebox.glb'

const Main = () => {

    const loader = new GLTFLoader();

    loader.load(model, (d) => {
        const entity = document.getElementById("jukebox")
        entity.object3D.add(d.scene);
      });

    const songs = songsdata;
    const [isplaying, setisplaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(songsdata[0]);
    const audioElem = useRef(null);
    
    useEffect(() => {
        const play = document.querySelector("#play_button");
        if (isplaying) {
            audioElem.current.play();
            play.setAttribute("material", {src: "#pause"})
        } else {
            audioElem.current.pause();
            play.setAttribute("material", {src: "#play"})
        }
    }, [isplaying]);
    
    const onPlaying = () => {
        const duration = audioElem.current.duration;
        const ct = audioElem.current.currentTime;

        setCurrentSong({ ...currentSong, "progress": ct / duration * 100, "length": duration })
    }

    useEffect(() => {
        const play = document.querySelector('#play_button');
        const next = document.querySelector('#next_button');
        const prev = document.querySelector('#prev_button');
        
        play.addEventListener('click', () =>{
            PlayPause()
        });
        
        next.addEventListener('click', () =>{
            console.log("next");
            skiptoNext()
        });
        
        prev.addEventListener('click', () =>{
            console.log("prev");
            skipBack()
        })
    
        const PlayPause = () => {
            setisplaying(!isplaying);
        }

        const skipBack = () => {
            const index = songs.findIndex((x) => x.title === currentSong.title);
            if (index === 0) {
                setCurrentSong(songs[songs.length - 1])
            } else {
                setCurrentSong(songs[index - 1])
            }
            audioElem.current.currentTime = 0;
        }

        const skiptoNext = () => {
            const index = songs.findIndex((x) => x.title === currentSong.title);
            if (index === songs.length-1) {
                setCurrentSong(songs[0])
            } else {
                setCurrentSong(songs[index + 1])
            }
            audioElem.current.currentTime = 0;
        }

}, [currentSong, isplaying, songs])
    
  return (
    <>
    <audio
        src={currentSong.url}
        ref={audioElem}
        onTimeUpdate={onPlaying} />
    <a-scene>
        <a-assets>
            <img id="play" src={require('./assets/play.png')} alt="tba" />
            <img id="pause" src={require('./assets/pause.png')} alt="tba" />
            <img id="prev" src={require('./assets/prev.png')} alt="tba" />
            <img id="next" src={require('./assets/next.png')} alt="tba" />
            <img id="skyTexture" src="https://cdn.aframe.io/a-painter/images/sky.jpg" mixin="poster" alt="tba" />
            <img id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg" alt="tba" />
            <a-mixin 
                id="button"
                geometry="primitive: plane; width: .5; height:.5"
                material="transparent: true"
                animation__scale="property: scale; to: 1.3 1.3 1.3; dur: 200; startEvents: mouseenter"
                animation__scale_reverse="property: scale; to: 1 1 1; dur: 200; startEvents: mouseleave"
                />
            <a-mixin 
                id="trackChange"
                geometry="primitive: plane; width: .3; height:.3"
                material="transparent: true"
                animation__scale="property: scale; to: 1.3 1.3 1.3; dur: 200; startEvents: mouseenter"
                animation__scale_reverse="property: scale; to: 1 1 1; dur: 200; startEvents: mouseleave"
                />
            <a-mixin 
                id="poster"
                geometry="primitive: plane; width: 1.55; height:1.55"
                material="colr: #fff; shader: flat"
                position="0 0.173 0.005"
                />
        </a-assets>
        <a-sky 
            material="src: #skyTexture"
            rotation="0 0 0"
            height="2048"
            radius="30"
            theta-length="90"
            width="2048" />
        <a-plane 
            material="src: #groundTexture"
            rotation="-90 0 0"
            height="100"
            width="100" />
        <a-entity 
            id="jukebox"
            position="2, 0, -5.5"
            rotation="0 160 0"
            scale="2 2 2" />
            <a-entity id="ui" position="0 2.1 -2.5">
                <a-entity position="-1.5 0 0.0">
                    <a-image src={currentSong.thumbnail} scale="2 2" />
                </a-entity>
                <a-entity id="music_frame" position="0 .281 .05" mixin="frame">
                <a-entity scale="4 4 1" position="0 0.2 0" text={`value: ${currentSong.title}; align: center`} />
                <a-entity scale="3 3 1" position="0 -0.2 0" text={`value: ${currentSong.artist}; align: center`} />
                    <a-entity id="play_button" material="src:#play" mixin="button" position="0 -.85 .052" />
                    <a-entity id="next_button" material="src:#next" mixin="trackChange" position=".6 -.85 .052" />
                    <a-entity id="prev_button" material="src:#prev" mixin="trackChange" position="-.6 -.85 .052" />
                </a-entity>
            </a-entity>
            <a-camera position="0, 1.6 .8">
                <a-cursor color="red"></a-cursor>
            </a-camera>
        </a-scene>
    </>
  )
}

export default Main