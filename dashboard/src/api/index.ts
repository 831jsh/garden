/*
 * Copyright (C) 2018 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import axios from "axios"

import {
  FetchConfigResponse,
  FetchStatusResponse,
  FetchLogsResponse,
  ApiRequest,
  FetchGraphResponse,
} from "./types"

export type FetchLogsParam = string[]

const MAX_LOG_LINES = 5000

export async function fetchConfig(): Promise<FetchConfigResponse> {
  return apiPost<FetchConfigResponse>("get.config")
}

export async function fetchGraph(): Promise<FetchGraphResponse> {
  return apiPost<FetchGraphResponse>("get.graph")
}

export async function fetchStatus(): Promise<FetchStatusResponse> {
  return apiPost<FetchStatusResponse>("get.status")
}

export async function fetchTaskResults(): Promise<any> {
  return apiPost<FetchStatusResponse>("get.tasks")
}

export async function fetchTasks(): Promise<FetchStatusResponse> {
  return apiPost<FetchStatusResponse>("get.status")
}

export async function fetchLogs(services: FetchLogsParam): Promise<FetchLogsResponse> {
  const tail = Math.floor(MAX_LOG_LINES / services.length)
  return apiPost<FetchLogsResponse>("logs", { services, tail })
}

async function apiPost<T>(command: string, parameters: {} = {}): Promise<T> {
  const url = "/api"
  const method = "POST"
  const headers = { "Content-Type": "application/json" }
  const data: ApiRequest = { command, parameters }

  const res = await axios({ url, method, headers, data })

  return res.data.result
}
