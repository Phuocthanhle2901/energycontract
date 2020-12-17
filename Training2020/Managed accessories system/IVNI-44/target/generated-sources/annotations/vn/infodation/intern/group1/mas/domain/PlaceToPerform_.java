package vn.infodation.intern.group1.mas.domain;

import java.time.Instant;
import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(PlaceToPerform.class)
public abstract class PlaceToPerform_ {

	public static volatile SingularAttribute<PlaceToPerform, String> address;
	public static volatile SingularAttribute<PlaceToPerform, String> phoneNumber;
	public static volatile SetAttribute<PlaceToPerform, ActionLog> actionLogs;
	public static volatile SingularAttribute<PlaceToPerform, Long> id;
	public static volatile SingularAttribute<PlaceToPerform, String> placeName;
	public static volatile SingularAttribute<PlaceToPerform, Instant> representativeName;
	public static volatile SingularAttribute<PlaceToPerform, String> email;

	public static final String ADDRESS = "address";
	public static final String PHONE_NUMBER = "phoneNumber";
	public static final String ACTION_LOGS = "actionLogs";
	public static final String ID = "id";
	public static final String PLACE_NAME = "placeName";
	public static final String REPRESENTATIVE_NAME = "representativeName";
	public static final String EMAIL = "email";

}

