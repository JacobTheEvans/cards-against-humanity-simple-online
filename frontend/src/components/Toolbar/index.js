import React from 'react'
import styled from 'styled-components'
import Logout from './Logout'

const Bar = styled.div`
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
`

function Toolbar () {
  return (
    <Bar>
      <Logout />
    </Bar>
  )
}

export default Toolbar
