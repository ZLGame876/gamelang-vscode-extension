import * as vscode from 'vscode';

export class GameLangDebugAdapter implements vscode.DebugAdapter {
    private _onDidSendMessage = new vscode.EventEmitter<any>();
    readonly onDidSendMessage = this._onDidSendMessage.event;

    private _runtime: GameLangRuntime | undefined;
    private _breakpoints = new Map<string, vscode.Breakpoint[]>();

    handleMessage(message: any): void {
        switch (message.type) {
            case 'request':
                const request = message as any;
                switch (request.command) {
                    case 'initialize':
                        this.sendResponse(request, {
                            supportsConfigurationDoneRequest: true,
                            supportsEvaluateForHovers: true,
                            supportsSetVariable: true,
                            supportsRestartRequest: true,
                            supportsStepBack: false,
                            supportsDataBreakpoints: false,
                            supportsCompletionsRequest: true,
                            supportsCancelRequest: true,
                            supportsBreakpointLocationsRequest: true,
                            supportsStepInTargetsRequest: false,
                            supportsExceptionFilterOptions: false,
                            supportsExceptionInfoRequest: false,
                            supportsValueFormattingOptions: false,
                            supportsExceptionOptions: false,
                            supportsFunctionBreakpoints: false,
                            supportsDelayedStackTraceLoading: false,
                            supportsLoadedSourcesRequest: false,
                            supportsLogPoints: false,
                            supportsTerminateThreadsRequest: false,
                            supportsSetExpression: false,
                            supportsTerminateRequest: true,
                            supportsModulesRequest: false,
                            supportsConditionalBreakpoints: true,
                            supportsHitConditionalBreakpoints: false,
                            supportsReadMemoryRequest: false,
                            supportsWriteMemoryRequest: false,
                            supportsDisassembleRequest: false,
                            supportsSteppingGranularity: false,
                            supportsInstructionBreakpoints: false,
                            supportsExceptionBreakpointFilters: false,
                            supportsSingleThreadExecutionRequests: false
                        });
                        break;

                    case 'launch':
                        this.launch(request);
                        break;

                    case 'setBreakpoints':
                        this.setBreakpoints(request);
                        break;

                    case 'threads':
                        this.sendResponse(request, {
                            threads: [{
                                id: 1,
                                name: 'GameLang Thread'
                            }]
                        });
                        break;

                    case 'stackTrace':
                        this.stackTrace(request);
                        break;

                    case 'scopes':
                        this.scopes(request);
                        break;

                    case 'variables':
                        this.variables(request);
                        break;

                    case 'continue':
                        this.continue(request);
                        break;

                    case 'next':
                        this.next(request);
                        break;

                    case 'stepIn':
                        this.stepIn(request);
                        break;

                    case 'stepOut':
                        this.stepOut(request);
                        break;

                    case 'disconnect':
                        this.disconnect(request);
                        break;

                    default:
                        this.sendErrorResponse(request, 1014, `Unrecognized command: ${request.command}`);
                        break;
                }
                break;
        }
    }

    private launch(request: any): void {
        const args = request.arguments as any;
        const program = args.program;

        if (!program) {
            this.sendErrorResponse(request, 3000, 'Program not specified');
            return;
        }

        this._runtime = new GameLangRuntime(program);
        
        this.sendResponse(request, {});
        this.sendEvent({ type: 'event', event: 'initialized' });
    }

    private setBreakpoints(request: any): void {
        const args = request.arguments as any;
        const path = args.source.path;
        const breakpoints = args.breakpoints as any[];

        const sourceBreakpoints = breakpoints.map(bp => {
            const line = bp.line;
            const condition = bp.condition;
            
            // 创建断点
            const breakpoint = new vscode.SourceBreakpoint(
                new vscode.Location(vscode.Uri.file(path), new vscode.Position(line - 1, 0))
            );

            return breakpoint;
        });

        this._breakpoints.set(path, sourceBreakpoints);

        this.sendResponse(request, {
            breakpoints: sourceBreakpoints.map(bp => ({
                verified: true,
                line: bp.location.range.start.line + 1
            }))
        });
    }

    private stackTrace(request: any): void {
        if (!this._runtime) {
            this.sendErrorResponse(request, 3001, 'Runtime not initialized');
            return;
        }

        const stack = this._runtime.getStackTrace();
        
        this.sendResponse(request, {
            stackFrames: stack.map((frame, index) => ({
                id: index,
                name: frame.name,
                source: {
                    name: frame.file,
                    path: frame.file
                },
                line: frame.line,
                column: 0
            })),
            totalFrames: stack.length
        });
    }

    private scopes(request: any): void {
        this.sendResponse(request, {
            scopes: [
                {
                    name: 'Local',
                    variablesReference: 1,
                    expensive: false
                },
                {
                    name: 'Global',
                    variablesReference: 2,
                    expensive: false
                }
            ]
        });
    }

    private variables(request: any): void {
        const args = request.arguments as any;
        const variablesReference = args.variablesReference;

        let variables: any[] = [];

        if (variablesReference === 1) {
            // Local variables
            variables = this._runtime?.getLocalVariables() || [];
        } else if (variablesReference === 2) {
            // Global variables
            variables = this._runtime?.getGlobalVariables() || [];
        }

        this.sendResponse(request, { variables });
    }

    private continue(request: any): void {
        if (this._runtime) {
            this._runtime.continue();
        }
        this.sendResponse(request, {});
    }

    private next(request: any): void {
        if (this._runtime) {
            this._runtime.stepOver();
        }
        this.sendResponse(request, {});
    }

    private stepIn(request: any): void {
        if (this._runtime) {
            this._runtime.stepInto();
        }
        this.sendResponse(request, {});
    }

    private stepOut(request: any): void {
        if (this._runtime) {
            this._runtime.stepOut();
        }
        this.sendResponse(request, {});
    }

    private disconnect(request: any): void {
        if (this._runtime) {
            this._runtime.terminate();
        }
        this.sendResponse(request, {});
    }

    private sendResponse(request: any, body: any): void {
        this._onDidSendMessage.fire({
            type: 'response',
            request_seq: request.seq,
            success: true,
            command: request.command,
            body
        });
    }

    private sendErrorResponse(request: any, code: number, message: string): void {
        this._onDidSendMessage.fire({
            type: 'response',
            request_seq: request.seq,
            success: false,
            command: request.command,
            message,
            body: { error: { id: code, format: message } }
        });
    }

    private sendEvent(event: any): void {
        this._onDidSendMessage.fire(event);
    }

    dispose(): void {
        if (this._runtime) {
            this._runtime.terminate();
        }
    }
}

class GameLangRuntime {
    private _program: string;
    private _variables = new Map<string, any>();
    private _callStack: StackFrame[] = [];
    private _isRunning = false;

    constructor(program: string) {
        this._program = program;
        this._variables.set('__name__', '__main__');
    }

    getStackTrace(): StackFrame[] {
        return this._callStack;
    }

    getLocalVariables(): any[] {
        const locals: any[] = [];
        this._variables.forEach((value, name) => {
            if (!name.startsWith('__')) {
                locals.push({
                    name,
                    value: String(value),
                    type: typeof value,
                    variablesReference: 0
                });
            }
        });
        return locals;
    }

    getGlobalVariables(): any[] {
        const globals: any[] = [];
        this._variables.forEach((value, name) => {
            if (name.startsWith('__')) {
                globals.push({
                    name,
                    value: String(value),
                    type: typeof value,
                    variablesReference: 0
                });
            }
        });
        return globals;
    }

    continue(): void {
        this._isRunning = true;
        // 模拟继续执行
    }

    stepOver(): void {
        // 模拟单步跳过
        this._callStack.push({
            name: 'step_over',
            file: this._program,
            line: Math.floor(Math.random() * 100) + 1
        });
    }

    stepInto(): void {
        // 模拟单步进入
        this._callStack.push({
            name: 'step_into',
            file: this._program,
            line: Math.floor(Math.random() * 100) + 1
        });
    }

    stepOut(): void {
        // 模拟单步跳出
        if (this._callStack.length > 0) {
            this._callStack.pop();
        }
    }

    terminate(): void {
        this._isRunning = false;
    }
}

interface StackFrame {
    name: string;
    file: string;
    line: number;
} 