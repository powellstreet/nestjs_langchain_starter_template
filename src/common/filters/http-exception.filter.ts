import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR; // 기본 상태 코드
    let message = 'Internal server error'; // 기본 메시지
    let details = null;

    // HttpException인 경우 처리
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      message =
        typeof errorResponse === 'string'
          ? errorResponse
          : (errorResponse as any).message || message;
    }
    // Supabase 에러 처리
    else if (this.isSupabaseError(exception)) {
      status = HttpStatus.BAD_REQUEST; // Supabase 에러에 적합한 상태 코드 설정
      const supabaseError = exception as SupabaseError; // 타입 단언
      message = supabaseError.message || message;
      details = {
        code: supabaseError.code,
        hint: supabaseError.hint,
        details: supabaseError.details,
      };
    }
    // 일반 Error 객체 처리
    else if (exception instanceof Error) {
      message = exception.message || message;
    }

    // 응답 포맷
    response.status(status).json({
      success: false,
      data: null,
      message,
      errorCode: status,
      details, // Supabase 에러 관련 상세 정보
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  // Supabase 에러 판별 메서드
  private isSupabaseError(exception: unknown): exception is SupabaseError {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      'message' in exception
    );
  }
}

// Supabase 에러 타입 정의
interface SupabaseError {
  code: string;
  message: string;
  details: string | null;
  hint: string | null;
}
