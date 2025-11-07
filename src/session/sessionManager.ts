import GameSession from "./GameSession";

class SessionManager {
  private sessions = new Map<string, GameSession>();

  create(gameSession: GameSession) {
    this.sessions.set(gameSession.sessionId, gameSession)
    return gameSession
  }

  get(gameSessionId: string) {
    return this.sessions.get(gameSessionId)
  }

  delete(gameSessionId: string) {
    const s = this.sessions.get(gameSessionId)
    if (s) {
      // make a function in gameSession class that save the game related or important data when logout the game 

      // this.sessions.delete(gameSessionId)
    }
  }

  all() {
    return Array.from(this.sessions.values())
  }
}

export const sessionManager = new SessionManager()

