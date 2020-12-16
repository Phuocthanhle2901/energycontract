package vn.infodation.intern.group1.mas.domain;

import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Area.class)
public abstract class Area_ {

	public static volatile SingularAttribute<Area, Employee> leader;
	public static volatile SingularAttribute<Area, String> areaName;
	public static volatile SetAttribute<Area, Equipment> equipment;
	public static volatile SingularAttribute<Area, Long> id;
	public static volatile SetAttribute<Area, Employee> employees;

	public static final String LEADER = "leader";
	public static final String AREA_NAME = "areaName";
	public static final String EQUIPMENT = "equipment";
	public static final String ID = "id";
	public static final String EMPLOYEES = "employees";

}

