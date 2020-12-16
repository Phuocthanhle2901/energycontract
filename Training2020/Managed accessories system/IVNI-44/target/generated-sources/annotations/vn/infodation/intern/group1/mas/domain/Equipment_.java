package vn.infodation.intern.group1.mas.domain;

import java.time.Instant;
import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Equipment.class)
public abstract class Equipment_ {

	public static volatile SingularAttribute<Equipment, Area> area;
	public static volatile SingularAttribute<Equipment, String> note;
	public static volatile SingularAttribute<Equipment, Instant> purchaseDate;
	public static volatile SingularAttribute<Equipment, String> serialNumber;
	public static volatile SetAttribute<Equipment, StatusLog> statusLogs;
	public static volatile SetAttribute<Equipment, UserEquipmentActivityLog> userEquipmentActivityLogs;
	public static volatile SingularAttribute<Equipment, EquipmentType> equipmentType;
	public static volatile SingularAttribute<Equipment, String> technicalFeatures;
	public static volatile SetAttribute<Equipment, ActionLog> actionLogs;
	public static volatile SingularAttribute<Equipment, String> equipmentName;
	public static volatile SingularAttribute<Equipment, Long> id;
	public static volatile SingularAttribute<Equipment, EquipmentGroup> equipmentGroup;
	public static volatile SingularAttribute<Equipment, Employee> user;

	public static final String AREA = "area";
	public static final String NOTE = "note";
	public static final String PURCHASE_DATE = "purchaseDate";
	public static final String SERIAL_NUMBER = "serialNumber";
	public static final String STATUS_LOGS = "statusLogs";
	public static final String USER_EQUIPMENT_ACTIVITY_LOGS = "userEquipmentActivityLogs";
	public static final String EQUIPMENT_TYPE = "equipmentType";
	public static final String TECHNICAL_FEATURES = "technicalFeatures";
	public static final String ACTION_LOGS = "actionLogs";
	public static final String EQUIPMENT_NAME = "equipmentName";
	public static final String ID = "id";
	public static final String EQUIPMENT_GROUP = "equipmentGroup";
	public static final String USER = "user";

}

