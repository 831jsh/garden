/*
 * Copyright (C) 2018 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import chalk from "chalk"
import dedent = require("dedent")
import { uniq, flatten } from "lodash"
import { Garden } from "../garden"
import { Module } from "../types/module"
import { prepareRuntimeContext } from "../types/service"
import { ServiceConfig } from "../config/service"
import { LogEntry } from "../logger/log-entry"

// Returns true if validation succeeded, false otherwise.
export async function validateHotReloadOpt(
  garden: Garden, log: LogEntry, hotReloadServiceNames: string[],
): Promise<boolean> {
  const incompatibleServices: ServiceConfig[] = []

  for (const hotReloadService of await garden.getServiceConfigs(hotReloadServiceNames)) {
    // FIXME: this needs to be at the native level, not in the spec!
    const moduleConfig = await garden.getModuleConfigByService(hotReloadService.name)
    if (!moduleConfig.spec.hotReload) {
      incompatibleServices.push(hotReloadService)
    }
  }

  if (incompatibleServices.length === 0) {
    return true
  } else {
    const singular = incompatibleServices.length === 1
    const incompatibleServicesDescription = incompatibleServices
      .map(s => `${s.name} (from module ${s.module.name})`)
      .join("\n")
    const errMsg = dedent`
      Error: Hot reloading was requested for the following ${singular ? "service" : "services"}, \
      but ${singular ? "its parent module is" : "their parent modules are"} not configured \
      for hot reloading:

      ${incompatibleServicesDescription}

      Aborting.
    `
    log.error({ msg: errMsg })
    return false
  }

}

export async function hotReloadAndLog(garden: Garden, log: LogEntry, module: Module) {
  const logEntry = log.info({
    section: module.name,
    msg: "Hot reloading...",
    status: "active",
  })

  const serviceDependencyNames = uniq(flatten(module.services.map(s => s.config.dependencies)))
  const runtimeContext = await prepareRuntimeContext(
    garden, logEntry, module, await garden.getServices(serviceDependencyNames),
  )

  try {
    await garden.actions.hotReload({ log: logEntry, module, runtimeContext })
  } catch (err) {
    log.setError()
    throw err
  }

  const msec = logEntry.getDuration(5) * 1000
  logEntry.setSuccess({
    msg: chalk.green(`Done (took ${msec} ms)`),
    append: true,
  })

}
