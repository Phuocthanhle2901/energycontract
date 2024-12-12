package vn.infodation.intern.group1.mas.web.rest.errors;

public class ErrorCode {
    private ErrorCode(){}
    
    public static final String NOT_CONTAINS_FIRST_SPACE = "error.field.atLine.notContainsFirstSpace";
    public static final String NOT_CONTAINS_SPACES = "error.field.atLine.notContainsSpace";
    public static final String MAX_LENGTH = "error.field.atLine.max";
    public static final String MIN_LENGTH = "error.field.atLine.min";
    public static final String REQUIRED = "error.field.atLine.required";
    public static final String USER_EXISTED = "error.field.atLine.loginExist";
    public static final String NUMBER = "error.field.atLine.number";
    public static final String NOT_CONTAINS_NUMBER = "error.field.atLine.numberFalse";
    public static final String EMAIL = "error.field.atLine.email";
    public static final String ID_NOT_EXIST = "error.field.atLine.idFalse";
    public static final String NOT_CONTAINS_CHARACTERS = "error.field.atLine.characterFalse";
    public static final String INVALID_PHONE = "error.field.atLine.phone";
}
