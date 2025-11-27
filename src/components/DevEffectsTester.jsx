import React, { useState, useEffect } from 'react'

export default function DevEffectsTester(){
  const [mode, setMode] = useState('ice')

  useEffect(() => {
    function key(e){
      // quick keyboard shortcuts: I = ice burst, F = fire burst
      if(e.key === 'i' || e.key === 'I') doBurst('ice')
      if(e.key === 'f' || e.key === 'F') doBurst('fire')
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [])

  function doBurst(m){
    const x = window.innerWidth/2
    const y = window.innerHeight/2
    window.dispatchEvent(new CustomEvent('cryo:melt-burst', { detail: { x, y, mode: m } }))
  }

  function startMelt(m){
    const x = window.innerWidth/2
    const y = window.innerHeight/2
    window.dispatchEvent(new CustomEvent('cryo:melt-start', { detail: { x, y, mode: m } }))
  }

  function stopMelt(){
    window.dispatchEvent(new CustomEvent('cryo:melt-stop'))
  }

  return (
    <div style={{position:'fixed', right:12, bottom:12, zIndex:1200, background:'rgba(10,18,24,0.6)', color:'#dff6ff', padding:10, borderRadius:8, fontSize:13, fontFamily:'sans-serif'}}>
      <div style={{marginBottom:8, fontWeight:700}}>Dev Effects Tester</div>
      <div style={{display:'flex', gap:6, marginBottom:8}}>
        <button onClick={() => doBurst('ice')}>Burst Ice</button>
        <button onClick={() => doBurst('fire')}>Burst Fire</button>
      </div>
      <div style={{display:'flex', gap:6, marginBottom:8}}>
        <button onClick={() => startMelt('ice')}>Start Melt (Ice)</button>
        <button onClick={() => startMelt('fire')}>Start Melt (Fire)</button>
        <button onClick={stopMelt}>Stop Melt</button>
      </div>
      <div style={{display:'flex', gap:6, alignItems:'center'}}>
        <label style={{fontSize:12}}>Mode:</label>
        <select value={mode} onChange={e => setMode(e.target.value)} onBlur={e => {}}>
          <option value="ice">ice</option>
          <option value="fire">fire</option>
        </select>
      </div>
      <div style={{marginTop:6, fontSize:11, opacity:0.85}}>Shortcuts: I = ice, F = fire</div>
    </div>
  )
}
