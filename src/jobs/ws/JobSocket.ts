import Job from "../models/job"

class JobSocket {
    private WEB_SOCKET_JOBS_ROUTE: string = '/socket/jobs'

    private expressws: any

    constructor(expressws: any) {
        this.expressws = expressws
        this.createWebSocket(expressws.app)
    }
    
    private createWebSocket(app: any) {
        app.ws(this.WEB_SOCKET_JOBS_ROUTE, function(ws: any, req: any){})
    }
    
    
    public emitJobUpdate(job: Job) {
      const socket = this.expressws.getWss(this.WEB_SOCKET_JOBS_ROUTE)
      socket.clients.forEach((client: any) => {
        console.log(typeof client)
        client.send(JSON.stringify(job))
      },
      5000
      )
    } 

}

export default JobSocket