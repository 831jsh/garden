/*
 * Copyright (C) 2018 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import styled from "@emotion/styled/macro"
import React, { Component } from "react"

import { NavLink } from "./links"
import { Page } from "../containers/sidebar"

import { colors, fontMedium } from "../styles/variables"
import logo from "../assets/garden-logo.png"

interface Props {
  pages: Page[]
}

interface State {
  selectedTab: string
}

const Button = styled.li`
  ${fontMedium}
  border-radius: 2px;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  &: hover {
    background-color: ${colors.brightTealAccent};
    color: ${colors.white};
    border-color: ${colors.brightTealAccent};
  }
`

const Link = styled(NavLink)`
  display: inline-block;
  margin-left: 1rem;
  padding: 0.5em 0.5em 0.5em 0;
  width: 100%;
`

// Style and align properly
const Logo = styled.img`
  height: auto;
  margin-top: -50px;
  margin-left: -48px;
  width: 107%;
`

class Sidebar extends Component<Props, State> {

  constructor(props) {
    super(props)

    // TODO Use tab id instead of title
    this.state = {
      selectedTab: this.props.pages[0].path,
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(event) {
    this.setState({ selectedTab: event.target.path })
  }

  render() {
    return (
      <div className="pt-1 pb-1">
        <div>
          <NavLink to="/">
            <Logo src={logo} alt="Home" />
          </NavLink>
        </div>
        <nav>
          <ul>
            {this.props.pages.map(page => (
              <Button tabName={name} onClick={this.handleClick} key={page.title}>
                <Link
                  exact
                  to={{ pathname: page.path, state: page }}
                  title={page.description}>{page.title}
                </Link>
              </Button>
            ),
            )}
          </ul>
        </nav>
      </div>
    )
  }

}

export default Sidebar
