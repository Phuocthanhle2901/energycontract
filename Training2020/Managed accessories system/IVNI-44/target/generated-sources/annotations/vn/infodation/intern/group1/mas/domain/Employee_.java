package vn.infodation.intern.group1.mas.domain;

import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Employee.class)
public abstract class Employee_ {

	public static volatile SingularAttribute<Employee, Area> area;
	public static volatile SingularAttribute<Employee, String> phoneNumber;
	public static volatile SetAttribute<Employee, Area> areas;
	public static volatile SingularAttribute<Employee, Long> id;
	public static volatile SingularAttribute<Employee, User> user;

	public static final String AREA = "area";
	public static final String PHONE_NUMBER = "phoneNumber";
	public static final String AREAS = "areas";
	public static final String ID = "id";
	public static final String USER = "user";

}

