import { registerApplication, start } from 'single-spa'
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from 'single-spa-layout'
import layout from './serve-layout.html'

const serveImports = {
  '@gostdoc/manager': () => import('/dist/manager.js'),
  '@gostdoc/editor': () => import('/dist/editor.js'),
}

const routes = constructRoutes(layout)
const applications = constructApplications({
  routes,
  loadApp: ({ name }) => {
    return System.import(name).catch(() => {
      return serveImports[name]()
    })
  },
})
const layoutEngine = constructLayoutEngine({ routes, applications })

applications.forEach(registerApplication)
layoutEngine.activate()
start({ urlRerouteOnly: true })
