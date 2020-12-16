package vn.infodation.intern.group1.mas.domain;

import java.time.Instant;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(ActionLog.class)
public abstract class ActionLog_ {

	public static volatile SingularAttribute<ActionLog, Instant> actualEndDate;
	public static volatile SingularAttribute<ActionLog, String> note;
	public static volatile SingularAttribute<ActionLog, ActionType> actionType;
	public static volatile SingularAttribute<ActionLog, Instant> expectedEndDate;
	public static volatile SingularAttribute<ActionLog, Long> price;
	public static volatile SingularAttribute<ActionLog, Equipment> equipment;
	public static volatile SingularAttribute<ActionLog, Long> id;
	public static volatile SingularAttribute<ActionLog, Employee> user;
	public static volatile SingularAttribute<ActionLog, PlaceToPerform> placeToPerform;
	public static volatile SingularAttribute<ActionLog, Instant> startDate;

	public static final String ACTUAL_END_DATE = "actualEndDate";
	public static final String NOTE = "note";
	public static final String ACTION_TYPE = "actionType";
	public static final String EXPECTED_END_DATE = "expectedEndDate";
	public static final String PRICE = "price";
	public static final String EQUIPMENT = "equipment";
	public static final String ID = "id";
	public static final String USER = "user";
	public static final String PLACE_TO_PERFORM = "placeToPerform";
	public static final String START_DATE = "startDate";

}

