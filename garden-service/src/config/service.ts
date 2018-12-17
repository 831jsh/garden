/*
 * Copyright (C) 2018 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import deline = require("deline")
import * as Joi from "joi"
import { PrimitiveMap, joiIdentifier, joiArray } from "./common"
import { moduleOutputsSchema } from "./module"

export interface ServiceSpec { }

export interface BaseServiceSpec extends ServiceSpec {
  name: string
  dependencies: string[]
  outputs: PrimitiveMap
}

export const serviceOutputsSchema = moduleOutputsSchema

export const baseServiceSchema = Joi.object()
  .keys({
    name: joiIdentifier().required(),
    dependencies: joiArray(joiIdentifier())
      .description(deline`
        The names of any services that this service depends on at runtime, and the names of any
        tasks that should be executed before this service is deployed.
      `),
    outputs: serviceOutputsSchema,
  })
  .unknown(true)
  .meta({ extendable: true })
  .description("The required attributes of a service. This is generally further defined by plugins.")

export interface ServiceConfig<T extends ServiceSpec = ServiceSpec> extends BaseServiceSpec {
  // Plugins can add custom fields that are kept here
  spec: T
}

export const serviceConfigSchema = baseServiceSchema
  .keys({
    spec: Joi.object()
      .meta({ extendable: true })
      .description("The service's specification, as defined by its provider plugin."),
  })
  .description("The configuration for a module's service.")
