
export class ConnectionErrorApi extends Error {
    constructor(message) {
      super(message);
      this.name = 'ConnectionErrorApi';
    }
}

export class ErrorInternalServer extends Error{
    constructor(message) {
        super(message);
        this.name = 'ErrorInternalServer';
      }
}