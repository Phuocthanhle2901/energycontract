package vn.infodation.intern.group1.mas.domain;

import java.time.Instant;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(UserEquipmentActivityLog.class)
public abstract class UserEquipmentActivityLog_ {

	public static volatile SingularAttribute<UserEquipmentActivityLog, Instant> date;
	public static volatile SingularAttribute<UserEquipmentActivityLog, String> activity;
	public static volatile SingularAttribute<UserEquipmentActivityLog, Equipment> equipment;
	public static volatile SingularAttribute<UserEquipmentActivityLog, Long> id;
	public static volatile SingularAttribute<UserEquipmentActivityLog, Employee> user;

	public static final String DATE = "date";
	public static final String ACTIVITY = "activity";
	public static final String EQUIPMENT = "equipment";
	public static final String ID = "id";
	public static final String USER = "user";

}

