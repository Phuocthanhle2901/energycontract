package vn.infodation.intern.group1.mas.web.rest.errors;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PhoneValidate {
    private final String patterns 
      = "^(\\+\\d{1,3}( )?)?((\\(\\d{3}\\))|\\d{3})[- .]?\\d{3}[- .]?\\d{4}$" 
      + "|^(\\+\\d{1,3}( )?)?(\\d{3}[ ]?){2}\\d{3}$" 
      + "|^(\\+\\d{1,3}( )?)?(\\d{3}[ ]?)(\\d{2}[ ]?){2}\\d{2}$";
    private Pattern pattern;

    public PhoneValidate(){
        this.pattern = Pattern.compile(this.patterns);
    }

    public boolean isValid(String phone){
        Matcher matcher = pattern.matcher(phone);
        return matcher.matches();
    }
}
