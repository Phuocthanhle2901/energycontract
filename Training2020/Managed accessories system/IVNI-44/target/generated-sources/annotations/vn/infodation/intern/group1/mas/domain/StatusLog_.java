package vn.infodation.intern.group1.mas.domain;

import java.time.Instant;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(StatusLog.class)
public abstract class StatusLog_ {

	public static volatile SingularAttribute<StatusLog, String> note;
	public static volatile SingularAttribute<StatusLog, StatusType> statusType;
	public static volatile SingularAttribute<StatusLog, Instant> statusDateTime;
	public static volatile SingularAttribute<StatusLog, Equipment> equipment;
	public static volatile SingularAttribute<StatusLog, Long> id;

	public static final String NOTE = "note";
	public static final String STATUS_TYPE = "statusType";
	public static final String STATUS_DATE_TIME = "statusDateTime";
	public static final String EQUIPMENT = "equipment";
	public static final String ID = "id";

}

