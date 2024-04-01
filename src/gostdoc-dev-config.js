import { registerApplication, start } from 'single-spa'
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from 'single-spa-layout'
import layout from './dev-layout.html'

const devImports = {
  '@gostdoc/manager': () =>
    import(/* webpackIgnore: true */ '//localhost:8081/src/main.js'),
}

const routes = constructRoutes(layout)
const applications = constructApplications({
  routes,
  loadApp: ({ name }) => {
    return System.import(name).catch(() => {
      return devImports[name]()
    })
  },
})
const layoutEngine = constructLayoutEngine({ routes, applications })

applications.forEach(registerApplication)
layoutEngine.activate()
start({ urlRerouteOnly: true })
